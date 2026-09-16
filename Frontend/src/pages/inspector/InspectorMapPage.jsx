import { MapPin, Building, ShieldAlert, Navigation, Layers } from 'lucide-react';

export default function InspectorMapPage() {
  const pins = [
    { name: 'Shiv Shakti Agro Foods (Sunflower Oil)', risk: 8.4, address: 'Naroda GIDC, Ahmedabad', lat: '23.08', lng: '72.63' },
    { name: 'Narmada Edibles & Staples', risk: 6.2, address: 'Sanand Industrial Estate, Gujarat', lat: '23.00', lng: '72.38' },
    { name: 'Apex Consumer Products Ltd', risk: 4.1, address: 'Changodar Industrial Zone', lat: '22.92', lng: '72.45' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Risk-Weighted Inspection Route Map</h1>
          <p className="text-xs text-text-secondary">
            Visual geospatial map targeting high-risk manufacturers and active consumer grievance clusters.
          </p>
        </div>
      </div>

      {/* Map Interactive Container */}
      <div className="rounded-2xl border border-border bg-surface p-4 shadow-xs space-y-4">
        <div className="relative h-96 w-full overflow-hidden rounded-xl border border-border bg-slate-900 flex flex-col justify-between p-4 text-white">
          {/* Top Controls Overlay */}
          <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-2 bg-slate-800/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700 text-xs font-semibold">
              <Layers className="h-4 w-4 text-accent-saffron" />
              <span>Layer: Risk Score Heatmap</span>
            </div>
            <span className="text-xs bg-slate-800/90 px-3 py-1.5 rounded-lg border border-slate-700 font-mono text-accent-saffron">
              Region: Gujarat Metrology Zone 4
            </span>
          </div>

          {/* Map Graphic Canvas Placeholder */}
          <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
            <div className="w-full h-full bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
          </div>

          {/* Pin Markers */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-3 my-auto">
            {pins.map((pin, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-700 bg-slate-800/90 p-3.5 space-y-2 text-xs backdrop-blur-md hover:border-accent-saffron transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-bold text-white">
                    <MapPin className="h-4 w-4 text-red-500" />
                    {pin.name}
                  </span>
                  <span className="rounded bg-red-500/20 px-1.5 py-0.5 text-[10px] font-bold text-red-400 border border-red-500/30">
                    Risk {pin.risk}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">{pin.address}</p>
                <div className="flex items-center justify-between pt-1 border-t border-slate-700/60 text-[10px] text-slate-400">
                  <span>GPS: {pin.lat}, {pin.lng}</span>
                  <span className="text-accent-saffron font-semibold flex items-center gap-1">
                    <Navigation className="h-3 w-3" />
                    Route
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Map Footer Info */}
          <div className="z-10 flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
            <span>Powered by OpenStreetMap & Gazette Enforcement Radar</span>
            <span>3 High-Risk Inspection Targets Nearby</span>
          </div>
        </div>
      </div>
    </div>
  );
}
