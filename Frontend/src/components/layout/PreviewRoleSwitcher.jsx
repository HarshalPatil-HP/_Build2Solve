import { ROLES } from '../../utils/roleGuards';
import { useAuthPreview } from '../../context/AuthPreviewContext';

/**
 * Checkpoint 1 only: lets us click through all 45 routes without a live JWT.
 * TODO(checkpoint-2): remove this bar once AuthContext is wired to /api/auth.
 */
export default function PreviewRoleSwitcher() {
  const { user, setPreviewRole, logout } = useAuthPreview();

  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-border bg-primary px-3 py-2 text-xs text-white">
      <span className="font-semibold tracking-wide uppercase opacity-80">Preview role</span>
      {Object.values(ROLES).map((role) => (
        <button
          key={role}
          type="button"
          onClick={() => setPreviewRole(role, 'active')}
          className={`rounded-full px-2.5 py-1 capitalize ${
            user?.role === role && user?.status === 'active' ? 'bg-accent-saffron text-primary' : 'bg-white/10 hover:bg-white/20'
          }`}
        >
          {role}
        </button>
      ))}
      <button
        type="button"
        onClick={() => setPreviewRole(ROLES.INSPECTOR, 'pending')}
        className={`rounded-full px-2.5 py-1 ${
          user?.role === ROLES.INSPECTOR && user?.status === 'pending' ? 'bg-accent-saffron text-primary' : 'bg-white/10 hover:bg-white/20'
        }`}
      >
        inspector pending
      </button>
      <button type="button" onClick={logout} className="rounded-full bg-white/10 px-2.5 py-1 hover:bg-white/20">
        log out
      </button>
    </div>
  );
}
