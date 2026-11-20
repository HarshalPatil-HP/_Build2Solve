"""Prepare the spike input and draw normalized boxes on the same oriented source."""
import io
import json
import sys
from PIL import Image, ImageDraw, ImageOps

mode, source = sys.argv[1:3]
image = (Image.new("RGB", (600, 400), "white") if source == "--blank"
         else ImageOps.exif_transpose(Image.open(source)).convert("RGB"))
if mode == "resize":
    # Reduce even small inputs, preserving aspect ratio without cropping or padding.
    scale = min(0.8, 960 / max(image.size))
    size = tuple(max(1, round(length * scale)) for length in image.size)
    buffer = io.BytesIO()
    image.resize(size, Image.Resampling.LANCZOS).save(buffer, "JPEG", quality=88)
    sys.stdout.buffer.write(buffer.getvalue())
elif mode == "overlay":
    draw = ImageDraw.Draw(image)
    for name, box in json.load(sys.stdin).items():
        if box is None:
            continue
        top, left, bottom, right = box
        x = lambda n: min(image.width - 1, round(n * image.width / 1000))
        y = lambda n: min(image.height - 1, round(n * image.height / 1000))
        draw.rectangle((x(left), y(top), x(right), y(bottom)), outline="#ff4800", width=2)
        label_x = max(0, min(x(left), image.width - int(draw.textlength(name)) - 4))
        label_y = max(0, y(top) - 15)
        draw.rectangle((label_x, label_y, label_x + draw.textlength(name) + 4,
                        label_y + 14), fill="#211a19")
        draw.text((label_x + 2, label_y), name, fill="white")
    image.save(sys.argv[3], "PNG")
