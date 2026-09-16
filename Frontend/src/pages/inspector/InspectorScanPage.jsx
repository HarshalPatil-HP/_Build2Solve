import { useState, useEffect } from 'react';
import ScanPage from '../scan/ScanPage';
import { MapPin, Shield } from 'lucide-react';

export default function InspectorScanPage() {
  const [coords, setCoords] = useState(null);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({
            lat: pos.coords.latitude.toFixed(5),
            lng: pos.coords.longitude.toFixed(5),
          });
        },
        () => {}
      );
    }
  }, []);

  return (
    <div className="space-y-4">
      {/* GPS GeoTag Banner */}
      <div className="rounded-xl border border-border bg-surface p-3.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-status-non-compliant animate-bounce" />
          <span className="font-bold text-text-primary">Official Field Inspection Geo-Tag Active</span>
        </div>
        <span className="font-mono text-text-secondary bg-bg px-2 py-0.5 rounded border border-border">
          {coords ? `GPS: ${coords.lat}°N, ${coords.lng}°E` : 'Locating GPS Coordinates...'}
        </span>
      </div>

      <ScanPage />
    </div>
  );
}
