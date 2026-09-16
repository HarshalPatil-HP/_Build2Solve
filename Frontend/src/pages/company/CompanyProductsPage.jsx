import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { scanService } from '../../services/scanService';
import StatusPill from '../../components/common/StatusPill';
import { Package, Search, Calendar, ChevronRight } from 'lucide-react';

export default function CompanyProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    scanService.getScans({ page: 1, limit: 20 })
      .then((res) => {
        const data = res.data || res;
        setProducts(Array.isArray(data) ? data : (data.scans || data.docs || []));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Company Product Portfolio</h1>
        <p className="text-xs text-text-secondary">
          Track statutory compliance status across all registered SKU label designs.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6 shadow-xs space-y-4">
        {products.length === 0 ? (
          <div className="py-12 text-center text-xs text-text-secondary">
            No products registered. Scan a product label to add to portfolio.
          </div>
        ) : (
          <div className="divide-y divide-border rounded-xl border border-border overflow-hidden">
            {products.map((p) => {
              const id = p._id || p.id;
              const name = p.productName || p.analysis?.fields?.genericName?.value || 'Packaged SKU';

              return (
                <div key={id} className="flex items-center justify-between p-4 bg-surface hover:bg-bg/50 transition-colors text-xs">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Package className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold text-text-primary">{name}</p>
                      <p className="text-[10px] text-text-secondary">Category: {p.category || 'General'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <StatusPill status={p.overallStatus} />
                    <Link
                      to={`/company/products/${id}/history`}
                      className="flex items-center gap-1 font-semibold text-primary hover:underline"
                    >
                      <span>Scan History</span>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
