import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { scanService } from '../../services/scanService';
import StatusPill from '../../components/common/StatusPill';
import { Search, Filter, Calendar, FileText, ChevronLeft, ChevronRight, Loader2, Camera } from 'lucide-react';
import { format } from 'date-fns';

export default function HistoryPage() {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchScans = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await scanService.getScans({
        page,
        limit,
        status: statusFilter || undefined,
      });
      const data = response.data || response;
      if (Array.isArray(data)) {
        setScans(data);
        setTotalPages(1);
      } else {
        setScans(data.scans || data.docs || []);
        setTotalPages(data.totalPages || Math.ceil((data.total || 1) / limit));
      }
    } catch (err) {
      setError(err.message || 'Failed to load scan history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScans();
  }, [page, statusFilter]);

  const filteredScans = scans.filter((s) => {
    if (!searchQuery) return true;
    const name = s.productName || s.analysis?.fields?.genericName?.value || '';
    const id = s._id || s.id || '';
    return name.toLowerCase().includes(searchQuery.toLowerCase()) || id.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Statutory Scan Repository</h1>
          <p className="text-xs text-text-secondary">
            Paginated audit history of all scanned packaged commodities and legal metrology declarations.
          </p>
        </div>

        <Link
          to="/scan"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-primary-light transition-colors"
        >
          <Camera className="h-4 w-4" />
          <span>New Product Scan</span>
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-xl border border-border bg-surface p-3 shadow-xs">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-text-secondary" />
          <input
            type="text"
            placeholder="Search by product name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-border bg-bg pl-9 pr-3 py-1.5 text-xs focus:border-primary focus:bg-surface focus:outline-none"
          />
        </div>

        {/* Status Dropdown */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Filter className="h-4 w-4 text-text-secondary" />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-border bg-bg px-3 py-1.5 text-xs font-semibold text-text-primary focus:border-primary focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="compliant">Compliant</option>
            <option value="non_compliant">Non-Compliant</option>
            <option value="needs_review">Needs Review</option>
          </select>
        </div>
      </div>

      {/* Scan List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-xs font-semibold text-text-secondary">Fetching scan repository...</p>
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-xs text-status-non-compliant space-y-2">
          <p className="font-bold">Error loading history</p>
          <p>{error}</p>
          <button
            type="button"
            onClick={fetchScans}
            className="mt-2 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-light"
          >
            Retry
          </button>
        </div>
      ) : filteredScans.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-surface p-12 text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Camera className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-text-primary">No scans found</h3>
            <p className="text-xs text-text-secondary max-w-sm mx-auto">
              No scan dockets match your search or filter criteria. Perform a new product scan to build your audit trail.
            </p>
          </div>
          <Link
            to="/scan"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-primary-light"
          >
            Start First Scan
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredScans.map((s) => {
            const scanId = s._id || s.id;
            const name = s.productName || s.analysis?.fields?.genericName?.value || 'Packaged Commodity';
            const dateStr = s.createdAt ? format(new Date(s.createdAt), 'dd MMM yyyy, HH:mm') : 'Recently';
            const imageThumb = Array.isArray(s.imageUrls) ? s.imageUrls[0] : s.imageUrls;

            return (
              <div
                key={scanId}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-border bg-surface p-4 shadow-xs hover:border-primary/40 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-border bg-black/5">
                    {imageThumb ? (
                      <img src={imageThumb} alt={name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[10px] text-text-secondary">No img</div>
                    )}
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-text-primary truncate">{name}</h4>
                      <StatusPill status={s.overallStatus} />
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-text-secondary">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {dateStr}
                      </span>
                      <span>Category: <strong className="uppercase">{s.category || 'general'}</strong></span>
                      <span className="hidden md:inline font-mono">ID: {scanId.substring(0, 8)}...</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    to={`/scan/${scanId}/result`}
                    className="flex-1 sm:flex-none rounded-lg border border-border bg-bg px-3 py-1.5 text-center text-xs font-bold text-text-primary hover:bg-surface hover:text-primary transition-colors"
                  >
                    View Docket
                  </Link>
                  <Link
                    to={`/scan/${scanId}/report`}
                    className="rounded-lg bg-primary/10 p-2 text-primary hover:bg-primary/20 transition-colors"
                    title="Download Report"
                  >
                    <FileText className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border pt-4 text-xs">
          <span className="text-text-secondary">
            Page <strong className="text-text-primary">{page}</strong> of <strong className="text-text-primary">{totalPages}</strong>
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 font-semibold text-text-secondary hover:bg-bg disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </button>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 font-semibold text-text-secondary hover:bg-bg disabled:opacity-40"
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
