import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageUploader from '../../components/scan/ImageUploader';
import ScanLoadingState from '../../components/scan/ScanLoadingState';
import { scanService } from '../../services/scanService';
import { Shield, Sparkles, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';

export default function ScanPage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showMetadata, setShowMetadata] = useState(false);

  const [metadata, setMetadata] = useState({
    productName: '',
    category: 'other', // 'food' | 'cosmetics' | 'electronics' | 'other'
    packageWidthCm: '',
    packageHeightCm: '',
    isImported: false,
  });

  const navigate = useNavigate();

  const handleMetadataChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMetadata((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleScanSubmit = async (e) => {
    e.preventDefault();
    if (images.length === 0) {
      setError('Please upload or capture at least 1 label panel image.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      images.forEach((imgObj) => {
        if (imgObj.file) {
          formData.append('images', imgObj.file);
        }
      });

      if (metadata.productName) formData.append('productName', metadata.productName);
      if (metadata.category) formData.append('category', metadata.category);
      if (metadata.packageWidthCm) formData.append('packageWidthCm', metadata.packageWidthCm);
      if (metadata.packageHeightCm) formData.append('packageHeightCm', metadata.packageHeightCm);
      formData.append('isImported', metadata.isImported ? 'true' : 'false');

      const response = await scanService.createScan(formData);
      const scan = response.data || response;
      const scanId = scan._id || scan.id;

      navigate(`/scan/${scanId}/result`, { state: { scan } });
    } catch (err) {
      setError(err.message || 'Scan failed. Please check network connection and backend server.');
      setLoading(false);
    }
  };

  if (loading) {
    return <ScanLoadingState />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Info */}
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold text-text-primary">Packaged Commodity Label Scanner</h1>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed">
            Legal Metrology (Packaged Commodities) Rules, 2011 · Automated OCR & Placement Verification Engine
          </p>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-status-non-compliant">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Scan Request Error</p>
            <p className="mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Main Upload Form */}
      <form onSubmit={handleScanSubmit} className="space-y-6">
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-xs space-y-6">
          <ImageUploader images={images} onImagesChange={setImages} maxImages={4} />

          {/* Optional Package Metadata Toggle */}
          <div className="border-t border-border pt-4">
            <button
              type="button"
              onClick={() => setShowMetadata(!showMetadata)}
              className="flex items-center justify-between w-full text-left text-xs font-bold text-primary hover:underline py-1"
            >
              <span>Optional Calibration Details (Improves Rule 7 Font Size Accuracy)</span>
              {showMetadata ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>

            {showMetadata && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 text-xs">
                <div>
                  <label className="block font-semibold text-text-primary mb-1">
                    Product Name / Brand
                  </label>
                  <input
                    type="text"
                    name="productName"
                    value={metadata.productName}
                    onChange={handleMetadataChange}
                    placeholder="e.g. Fortified Edible Sunflower Oil"
                    className="w-full rounded-lg border border-border bg-bg px-3 py-2 focus:border-primary focus:bg-surface focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-text-primary mb-1">
                    Product Category
                  </label>
                  <select
                    name="category"
                    value={metadata.category}
                    onChange={handleMetadataChange}
                    className="w-full rounded-lg border border-border bg-bg px-3 py-2 focus:border-primary focus:bg-surface focus:outline-none"
                  >
                    <option value="other">General / Electronics / Other</option>
                    <option value="food">Food & Edible Commodities (FSSA 2006)</option>
                    <option value="cosmetics">Cosmetics & Toiletries (Drugs Act 1945)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-text-primary mb-1">
                    Package Display Width (cm)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    name="packageWidthCm"
                    value={metadata.packageWidthCm}
                    onChange={handleMetadataChange}
                    placeholder="e.g. 15.0"
                    className="w-full rounded-lg border border-border bg-bg px-3 py-2 focus:border-primary focus:bg-surface focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-text-primary mb-1">
                    Package Display Height (cm)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    name="packageHeightCm"
                    value={metadata.packageHeightCm}
                    onChange={handleMetadataChange}
                    placeholder="e.g. 22.0"
                    className="w-full rounded-lg border border-border bg-bg px-3 py-2 focus:border-primary focus:bg-surface focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2 flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="isImported"
                    name="isImported"
                    checked={metadata.isImported}
                    onChange={handleMetadataChange}
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                  />
                  <label htmlFor="isImported" className="font-semibold text-text-primary">
                    Imported Commodity (Enforces Rule 6(1)(aa) Country of Origin Declaration)
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Submit Action */}
        <button
          type="submit"
          disabled={images.length === 0}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-base font-bold text-white shadow-md hover:bg-primary-light disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <Sparkles className="h-5 w-5 text-accent-saffron" />
          <span>Scan & Run Statutory Compliance Verification ({images.length} Panels)</span>
        </button>
      </form>
    </div>
  );
}
