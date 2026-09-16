import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getPostLoginPath } from '../../utils/roleGuards';
import { Shield, Lock, Mail, User, Building, ArrowRight, AlertCircle, Info, CheckCircle2 } from 'lucide-react';

export default function SlidingAuthPanel() {
  const [isSignup, setIsSignup] = useState(false);
  const [role, setRole] = useState('user'); // 'user' | 'company'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyId: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please enter your email and password.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await login(formData.email, formData.password);
      const user = res.user;
      const targetPath = location.state?.from || getPostLoginPath(user);
      navigate(targetPath, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all required fields.');
      return;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (role === 'company' && !formData.companyId) {
      setError('Please provide your 24-character Company Registration / ID.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: role,
        ...(role === 'company' ? { companyId: formData.companyId } : {}),
      };
      const res = await signup(payload);
      const user = res.user;
      const targetPath = getPostLoginPath(user);
      navigate(targetPath, { replace: true });
    } catch (err) {
      setError(err.message || 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl overflow-hidden rounded-2xl border border-border bg-surface shadow-xl">
      {/* Mobile Tab Header */}
      <div className="flex border-b border-border bg-bg/50 md:hidden">
        <button
          type="button"
          onClick={() => {
            setIsSignup(false);
            setError(null);
          }}
          className={`flex-1 py-3 text-center text-sm font-semibold transition-colors ${
            !isSignup
              ? 'border-b-2 border-primary text-primary bg-surface'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => {
            setIsSignup(true);
            setError(null);
          }}
          className={`flex-1 py-3 text-center text-sm font-semibold transition-colors ${
            isSignup
              ? 'border-b-2 border-primary text-primary bg-surface'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          Create Account
        </button>
      </div>

      <div className="relative flex flex-col md:flex-row md:min-h-[560px]">
        {/* Branding Info Panel (Desktop Sliding) */}
        <div
          className={`hidden md:flex md:w-1/2 flex-col justify-between p-8 bg-gradient-to-br from-primary to-primary-light text-white transition-transform duration-500 ease-in-out z-10 ${
            isSignup ? 'translate-x-full' : 'translate-x-0'
          }`}
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md border border-white/20">
                <Shield className="h-7 w-7 text-accent-saffron" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight">Legal Metrology Portal</h2>
                <p className="text-xs text-white/80">Department of Consumer Affairs</p>
              </div>
            </div>

            <div className="pt-6 space-y-3">
              <h3 className="text-2xl font-extrabold leading-snug">
                {isSignup ? 'Start Pre-Market & Label Audits' : 'Government Enforcement & Verification Engine'}
              </h3>
              <p className="text-sm text-white/80 leading-relaxed">
                {isSignup
                  ? 'Self-check packaged commodities against Legal Metrology (Packaged Commodities) Rules, 2011. Instant OCR extraction and statutory placement analysis.'
                  : 'Access real-time OCR label compliance checking, statutory rule engine, case dockets, and official compliance reports.'}
              </p>
            </div>

            <div className="space-y-2 pt-4">
              <div className="flex items-center gap-2 text-xs font-medium text-white/90">
                <CheckCircle2 className="h-4 w-4 text-accent-saffron shrink-0" />
                <span>Automated Rule 6 Mandatory Declaration Extraction</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-white/90">
                <CheckCircle2 className="h-4 w-4 text-accent-saffron shrink-0" />
                <span>Principal Display Panel (PDP) Font Size Validation</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-white/90">
                <CheckCircle2 className="h-4 w-4 text-accent-saffron shrink-0" />
                <span>Immutable Evidence Chain & PDF Audit Reports</span>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs text-white/70">
              {isSignup ? 'Already registered?' : "Don't have an account?"}
            </span>
            <button
              type="button"
              onClick={() => {
                setIsSignup(!isSignup);
                setError(null);
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-accent-saffron hover:underline"
            >
              <span>{isSignup ? 'Sign in now' : 'Create an account'}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Forms Container Panel */}
        <div
          className={`w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-center transition-transform duration-500 ease-in-out ${
            isSignup ? 'md:-translate-x-full' : 'translate-x-0'
          }`}
        >
          {error && (
            <div className="mb-4 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-status-non-compliant">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {!isSignup ? (
            /* LOGIN FORM */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-text-primary">Sign in to your account</h3>
                <p className="text-xs text-text-secondary">Enter your registered credentials to access the portal</p>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-text-secondary" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="name@organization.gov.in"
                      className="w-full rounded-lg border border-border bg-bg pl-9 pr-3 py-2 text-sm focus:border-primary focus:bg-surface focus:outline-none focus:ring-1 focus:ring-primary"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-text-primary">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => alert('For password resets, please contact your System Administrator or Department Helpdesk (1800-11-4000).')}
                      className="text-xs font-medium text-primary hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-text-secondary" />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      className="w-full rounded-lg border border-border bg-bg pl-9 pr-3 py-2 text-sm focus:border-primary focus:bg-surface focus:outline-none focus:ring-1 focus:ring-primary"
                      required
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-primary-light disabled:opacity-50 transition-colors"
              >
                {loading ? (
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              <div className="rounded-lg border border-border bg-bg p-3 text-xs text-text-secondary space-y-1">
                <p className="font-semibold text-text-primary flex items-center gap-1.5">
                  <Info className="h-3.5 w-3.5 text-primary" />
                  <span>Official Inspector Accounts:</span>
                </p>
                <p>
                  Inspector credentials are provisioned by Department Administrators. Use your official assigned login details above.
                </p>
              </div>
            </form>
          ) : (
            /* SIGNUP FORM */
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-text-primary">Create an account</h3>
                <p className="text-xs text-text-secondary">Select your registration type below</p>
              </div>

              {/* Role Selector */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('user')}
                  className={`flex items-center gap-2 rounded-lg border p-2.5 text-left text-xs transition-all ${
                    role === 'user'
                      ? 'border-primary bg-primary/5 text-primary font-bold'
                      : 'border-border bg-bg text-text-secondary hover:bg-surface'
                  }`}
                >
                  <User className="h-4 w-4 shrink-0" />
                  <div>
                    <p className="font-semibold">Consumer</p>
                    <p className="text-[10px] font-normal opacity-80">General Public</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('company')}
                  className={`flex items-center gap-2 rounded-lg border p-2.5 text-left text-xs transition-all ${
                    role === 'company'
                      ? 'border-primary bg-primary/5 text-primary font-bold'
                      : 'border-border bg-bg text-text-secondary hover:bg-surface'
                  }`}
                >
                  <Building className="h-4 w-4 shrink-0" />
                  <div>
                    <p className="font-semibold">Company</p>
                    <p className="text-[10px] font-normal opacity-80">Manufacturer / Packer</p>
                  </div>
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1">
                    Full Name / Entity Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder={role === 'company' ? 'e.g. Acme Consumer Goods Ltd' : 'e.g. Rajesh Kumar'}
                    className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm focus:border-primary focus:bg-surface focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="name@domain.com"
                    className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm focus:border-primary focus:bg-surface focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>

                {role === 'company' && (
                  <div>
                    <label className="block text-xs font-semibold text-text-primary mb-1">
                      Company Registration ID (24-char hex)
                    </label>
                    <input
                      type="text"
                      name="companyId"
                      value={formData.companyId}
                      onChange={handleInputChange}
                      placeholder="e.g. 64b8f1a2c9e7d40012a3b4c5"
                      className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm focus:border-primary focus:bg-surface focus:outline-none focus:ring-1 focus:ring-primary font-mono text-xs"
                      required
                    />
                    <p className="text-[10px] text-text-secondary mt-1">
                      Provided during initial enterprise registration with the Metrology Department.
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-text-primary mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Min. 8 chars"
                      className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm focus:border-primary focus:bg-surface focus:outline-none focus:ring-1 focus:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-primary mb-1">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Repeat password"
                      className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm focus:border-primary focus:bg-surface focus:outline-none focus:ring-1 focus:ring-primary"
                      required
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-primary-light disabled:opacity-50 transition-colors"
              >
                {loading ? (
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <span>Register Account</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
