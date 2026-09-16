import { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Upload, Camera, X, Image as ImageIcon, Plus } from 'lucide-react';

const PANEL_LABELS = [
  'Front Panel (Primary Display)',
  'Back Panel (MRP & Net Qty)',
  'Side Panel (Batch & Date)',
  'Packer & Consumer Care Panel',
];

export default function ImageUploader({ images, onImagesChange, maxImages = 4 }) {
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const [activeSlot, setActiveSlot] = useState(null);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newImageObjects = files.slice(0, maxImages - images.length).map((file, idx) => ({
      id: Math.random().toString(36).substring(2, 9),
      file,
      previewUrl: URL.createObjectURL(file),
      label: PANEL_LABELS[images.length + idx] || `Panel ${images.length + idx + 1}`,
    }));

    onImagesChange([...images, ...newImageObjects]);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const handleRemoveImage = (indexToRemove) => {
    const target = images[indexToRemove];
    if (target?.previewUrl) {
      URL.revokeObjectURL(target.previewUrl);
    }
    const updated = images.filter((_, idx) => idx !== indexToRemove);
    onImagesChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary">
          Label Photograph Panels ({images.length}/{maxImages})
        </label>
        <span className="text-xs text-text-secondary">
          Upload 1 to {maxImages} label photos showing all statutory text
        </span>
      </div>

      {/* Grid of Image Slots */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {images.map((img, idx) => (
          <div
            key={img.id || idx}
            className="group relative flex flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-primary/30 bg-surface shadow-xs transition-all aspect-square"
          >
            <img
              src={img.previewUrl}
              alt={img.label}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-90 transition-opacity" />

            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
              <span className="truncate text-[10px] font-semibold text-white bg-black/40 px-1.5 py-0.5 rounded backdrop-blur-xs">
                {img.label}
              </span>
              <button
                type="button"
                onClick={() => handleRemoveImage(idx)}
                className="rounded-full bg-red-600 p-1 text-white shadow-md hover:bg-red-700 transition-colors"
                title="Remove image"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}

        {images.length < maxImages && (
          <div className="flex flex-col gap-2 aspect-square">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 flex flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-border bg-bg/60 p-3 text-center transition-all hover:border-primary hover:bg-primary/5 active:scale-[0.98]"
            >
              <div className="rounded-lg bg-primary/10 p-2 text-primary">
                <Upload className="h-5 w-5" />
              </div>
              <span className="text-xs font-semibold text-text-primary">Upload Image</span>
              <span className="text-[10px] text-text-secondary">JPEG, PNG ≤ 5MB</span>
            </button>

            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-border bg-surface px-2 py-1.5 text-xs font-semibold text-text-secondary hover:bg-bg hover:text-primary transition-colors"
            >
              <Camera className="h-3.5 w-3.5" />
              <span>Capture Photo</span>
            </button>
          </div>
        )}
      </div>

      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/jpg"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}

ImageUploader.propTypes = {
  images: PropTypes.array.isRequired,
  onImagesChange: PropTypes.func.isRequired,
  maxImages: PropTypes.number,
};
