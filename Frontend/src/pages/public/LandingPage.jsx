import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Camera,
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowRight,
  FileText,
  Building,
  Ruler,
  Lock,
  Eye,
  ChevronRight,
  Scale,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import StatusPill from '../../components/common/StatusPill';

export default function LandingPage() {
  const [searchSKU, setSearchSKU] = useState('');
  const [activeTab, setActiveTab] = useState('how-it-works');

  const sampleProducts = [
    {
      gtin: '8901030041289',
      name: 'Premium Filter Coffee 500g',
      category: 'Food',
      netQty: '500 g',
      mrp: '₹440.00',
      usp: '₹0.88 / g',
      status: 'compliant',
      declarations: '7/7 Present',
    },
    {
      gtin: '8902579124938',
      name: 'Fortified Sunflower Oil 900ml Pouch',
      category: 'Edible Oil',
      netQty: '900 ml (Non-Standard)',
      mrp: '₹165.00',
      usp: 'Missing USP',
      status: 'non_compliant',
      declarations: '5/7 Present (Font Deficit -1.2mm)',
    },
    {
      gtin: '8901030013913',
      name: 'A2 Cow Milk 1L TetraPak',
      category: 'Food',
      netQty: '1 L',
      mrp: '₹75.00',
      usp: '₹75.00 / L',
      status: 'compliant',
      declarations: '7/7 Present',
    },
  ];

  return (
    <div className="space-y-10 pb-12">
      {/* Top Gazette Alert Banner */}
      <div className="rounded-xl bg-primary/10 border border-primary/20 p-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-primary font-bold">
          <span className="flex h-2 w-2 rounded-full bg-accent-saffron animate-ping" />
          <span className="rounded bg-primary text-white px-2 py-0.5 text-[10px] font-extrabold uppercase">
            GAZETTE ALERT [GSR 592(E)]
          </span>
          <span>Mandatory unit sale price (USP) format & month/year of manufacture enforcement active across all e-commerce listings & FMCG packages.</span>
        </div>
        <a href="#how-it-works" className="font-bold text-primary-light hover:underline shrink-0 flex items-center gap-1">
          <span>View S.O. Order</span>
          <ArrowRight className="h-3 w-3" />
        </a>
      </div>

      {/* Hero Section */}
      <div className="rounded-3xl border border-border bg-gradient-to-br from-surface via-surface to-bg p-8 md:p-12 shadow-xl space-y-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1 text-xs font-bold text-primary">
            <Scale className="h-3.5 w-3.5 text-accent-saffron" />
            <span>GOVT. OF INDIA · CENTRAL REGULATORY NODE · Act 1 of 2010 / PCR 2011</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-text-primary leading-tight">
            Statutory Packaged Commodity Verification & Enforcement Engine
          </h1>

          <p className="text-sm md:text-base text-text-secondary leading-relaxed">
            Governed under the <strong>Legal Metrology Act, 2009</strong> and the <strong>Packaged Commodities Rules, 2011 (Amended 2022/2024)</strong>. Real-time digital surveillance, Primary Display Panel (PDP) OCR inspection, and statutory declaration reconciliation.
          </p>
        </div>

        {/* Live SKU / GTIN Search Console */}
        <div className="max-w-2xl rounded-2xl border border-border bg-surface p-2 shadow-lg space-y-2">
          <div className="flex items-center gap-2 px-3 py-2 bg-bg rounded-xl border border-border">
            <Search className="h-5 w-5 text-text-secondary shrink-0" />
            <input
              type="text"
              value={searchSKU}
              onChange={(e) => setSearchSKU(e.target.value)}
              placeholder="Search compliant products by GTIN/Barcode, Brand Name, or Manufacturer Registration No. (LMPC No.)"
              className="w-full bg-transparent text-xs md:text-sm font-medium focus:outline-none text-text-primary"
            />
            <button
              type="button"
              onClick={() => alert(`Querying National Metrology Index for: "${searchSKU || '8901030041289'}"`)}
              className="rounded-lg bg-primary px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-primary-light transition-colors shrink-0"
            >
              Validate SKU
            </button>
          </div>

          <div className="flex items-center gap-2 px-3 text-[11px] text-text-secondary font-mono">
            <span>Recent Audits:</span>
            <span className="text-primary font-semibold hover:underline cursor-pointer">8901030013913 [A2 Cow Milk 1L]</span>
            <span>·</span>
            <span className="text-primary font-semibold hover:underline cursor-pointer">LMPC-IMP-2023-4410 [Dyson India]</span>
            <span>·</span>
            <span className="text-primary font-semibold hover:underline cursor-pointer">8902579124938 [Basmati Rice 5kg]</span>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
          <Link
            to="/scan"
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-white shadow-md hover:bg-primary-light active:scale-[0.99] transition-all"
          >
            <Camera className="h-5 w-5 text-accent-saffron" />
            <span>Start Immediate Multi-Angle Product Scan</span>
          </Link>

          <a
            href="#how-it-works"
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-border bg-surface px-6 py-3.5 text-sm font-bold text-text-primary hover:bg-bg transition-colors"
          >
            <FileText className="h-4 w-4 text-primary" />
            <span>Rule 6 Compliance Checklist</span>
          </a>
        </div>
      </div>

      {/* Tri-Role Statutory Terminals Section */}
      <div className="space-y-4">
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">ACCESS DEMARCATION</span>
          <h2 className="text-2xl font-bold text-text-primary">Tri-Role Statutory Operating Terminals</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Citizen Gateway */}
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-xs space-y-4 flex flex-col justify-between hover:border-primary/40 transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-status-compliant">
                  <Shield className="h-5 w-5" />
                </div>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                  CITIZEN GATEWAY
                </span>
              </div>
              <h3 className="text-lg font-bold text-text-primary">Public Rights & Grievance Lodgement</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Verify retail and e-commerce compliance before purchasing. Citizens are statutory protected against overcharging, missing unit sale prices, and misleading packaging size declarations.
              </p>
              <ul className="space-y-1.5 text-xs text-text-primary font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-status-compliant shrink-0" />
                  <span>Mandatory 7 Declarations instant verification tool</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-status-compliant shrink-0" />
                  <span>Unit Sale Price Audit: Report missing ₹/g or ₹/ml metric tags</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-status-compliant shrink-0" />
                  <span>Direct Docket Tracker: Monitor complaint resolution with State Controller</span>
                </li>
              </ul>
            </div>

            <Link
              to="/auth"
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-border bg-bg py-2.5 text-xs font-bold text-text-primary hover:bg-primary hover:text-white transition-all mt-4"
            >
              <span>Consumer Sign In / Scan</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Enterprise Desk */}
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-xs space-y-4 flex flex-col justify-between hover:border-primary/40 transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-primary">
                  <Building className="h-5 w-5" />
                </div>
                <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-[10px] font-bold text-blue-800">
                  ENTERPRISE DESK
                </span>
              </div>
              <h3 className="text-lg font-bold text-text-primary">Pre-Market Self-Certification & Risk Index</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Packers, manufacturers, and registered importers can run pre-flight statutory label validation, manage LMPC Registration certificates, and compute legal font heights prior to commercial distribution.
              </p>
              <ul className="space-y-1.5 text-xs text-text-primary font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>Batch PDP Validation: Bulk label artwork compliance checker</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>Rule 7 Font Calculator: Exact minimum mm heights for net weight</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>Digital LMPC Certificate: Form I II filing & renewal hub</span>
                </li>
              </ul>
            </div>

            <Link
              to="/auth"
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-border bg-bg py-2.5 text-xs font-bold text-text-primary hover:bg-primary hover:text-white transition-all mt-4"
            >
              <span>Company Sign In / Audit</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Official Gazette Terminal */}
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-xs space-y-4 flex flex-col justify-between hover:border-primary/40 transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
                  <Lock className="h-5 w-5" />
                </div>
                <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-[10px] font-bold text-purple-800">
                  OFFICIAL GAZETTED ONLY
                </span>
              </div>
              <h3 className="text-lg font-bold text-text-primary">Inspection Dockets, Field Audits & Seizure Logs</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Authorized inspectors and Assistant Controllers: Record field seizures, issue notices under Section 36(1) for unverified weights, and review verified laboratory tare test reports.
              </p>
              <ul className="space-y-1.5 text-xs text-text-primary font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-purple-700 shrink-0" />
                  <span>Section 36(1) Notice Generator: Auto-draft legal infraction notices</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-purple-700 shrink-0" />
                  <span>Field Seizure Log: Tamper-evident chain-of-custody tracking</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-purple-700 shrink-0" />
                  <span>Risk-Weighted Inspection Radar: AI-prioritized retail locations</span>
                </li>
              </ul>
            </div>

            <Link
              to="/auth"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-xs font-bold text-white shadow-xs hover:bg-primary-light transition-all mt-4"
            >
              <span>Inspector / Admin Login</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* How We Work Section */}
      <div id="how-it-works" className="rounded-3xl border border-border bg-surface p-8 space-y-8 shadow-xs">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
            AUTOMATED RECONCILIATION ENGINE
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-text-primary">How The Statutory Scan Verification Pipeline Operates</h2>
          <p className="text-xs text-text-secondary">
            From raw smartphone camera capture or e-commerce screenshot to an immutable court-admissible PDF compliance docket.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-border bg-bg p-5 space-y-3 relative">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white font-extrabold text-xs">
              1
            </div>
            <h4 className="font-bold text-sm text-text-primary">Multi-Angle Label Intake</h4>
            <p className="text-xs text-text-secondary leading-relaxed">
              Upload 1 to 4 label panels (Front PDP, Back, Side, Packer Info). Cloudinary stores original evidence image dockets securely.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-bg p-5 space-y-3 relative">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white font-extrabold text-xs">
              2
            </div>
            <h4 className="font-bold text-sm text-text-primary">Tesseract.js Dual OCR</h4>
            <p className="text-xs text-text-secondary leading-relaxed">
              Processes English & Devanagari text. Extracts word bounding boxes, glyph pixel heights, and OCR confidence scores.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-bg p-5 space-y-3 relative">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white font-extrabold text-xs">
              3
            </div>
            <h4 className="font-bold text-sm text-text-primary">Dynamic Rule Engine</h4>
            <p className="text-xs text-text-secondary leading-relaxed">
              Evaluates extracted values against DB-stored rules: Rule 6 (Mandatory fields), Rule 7 (PDP area font ratios), Rule 12(6) (Misleading words).
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-bg p-5 space-y-3 relative">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white font-extrabold text-xs">
              4
            </div>
            <h4 className="font-bold text-sm text-text-primary">Evidentiary Docket & PDF</h4>
            <p className="text-xs text-text-secondary leading-relaxed">
              Generates explainable pass/fail verdicts, updates company risk scores, and exports court-ready PDF/DOCX audit dockets.
            </p>
          </div>
        </div>
      </div>

      {/* Sample Verified SKU Table */}
      <div className="rounded-3xl border border-border bg-surface p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-text-primary">National Verified SKU Docket Registry</h3>
            <p className="text-xs text-text-secondary">Sample live audit records from verified packaged commodity scans</p>
          </div>
          <span className="text-[10px] font-mono text-text-secondary bg-bg px-2.5 py-1 rounded border border-border">
            DB Seed Rules Active: 14 Rules Version 2026.1
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-left text-xs">
            <thead className="bg-bg border-b border-border text-[11px] font-bold uppercase text-text-secondary">
              <tr>
                <th className="px-4 py-3">GTIN / Barcode</th>
                <th className="px-4 py-3">Commodity Name</th>
                <th className="px-4 py-3">Declared Net Qty</th>
                <th className="px-4 py-3">MRP (Incl. Taxes)</th>
                <th className="px-4 py-3">Unit Sale Price (USP)</th>
                <th className="px-4 py-3">Rule 6 Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sampleProducts.map((p, idx) => (
                <tr key={idx} className="hover:bg-bg/50 transition-colors">
                  <td className="px-4 py-3 font-mono text-text-secondary">{p.gtin}</td>
                  <td className="px-4 py-3 font-bold text-text-primary">{p.name}</td>
                  <td className="px-4 py-3 font-medium">{p.netQty}</td>
                  <td className="px-4 py-3 font-bold text-primary">{p.mrp}</td>
                  <td className="px-4 py-3 font-mono font-semibold">{p.usp}</td>
                  <td className="px-4 py-3">
                    <StatusPill status={p.status} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      to="/scan"
                      className="inline-flex items-center gap-1 font-bold text-primary hover:underline text-[11px]"
                    >
                      <span>Inspect</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Statutory Footer Details */}
      <div className="rounded-2xl bg-slate-900 text-white p-8 space-y-4 text-xs">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
              <Shield className="h-6 w-6 text-accent-saffron" />
            </div>
            <div>
              <p className="font-bold text-sm">Legal Metrology Compliance Portal</p>
              <p className="text-[10px] text-slate-400">Department of Consumer Affairs · Govt of India</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-slate-300 font-medium">
            <span>National Consumer Helpline: <strong>1915 / 1800-11-4000</strong></span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-slate-400 text-[11px] leading-relaxed">
          <div>
            <h5 className="font-bold text-white mb-1">STATUTORY REFERENCE</h5>
            <p>Mandatory Pre-packaged declarations, Net Weight tolerance slabs, E-commerce digital display statutory compliance verification.</p>
          </div>
          <div>
            <h5 className="font-bold text-white mb-1">TECHNICAL GOVERNANCE</h5>
            <p>Designed and hosted by National Informatics Centre (NIC). Ministry of Electronics & IT, Government of India.</p>
          </div>
          <div>
            <h5 className="font-bold text-white mb-1">REAL-WORLD CCPA CONTEXT</h5>
            <p>February 2026: CCPA reviewed e-commerce platforms resulting in 16,970 non-compliant listings delisted under LM Rules 2011.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
