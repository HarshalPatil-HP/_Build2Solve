import PropTypes from 'prop-types';

/**
 * Shared empty page used by Checkpoint 1 route skeleton.
 * Real page bodies replace this file's usage in later checkpoints.
 */
export default function PlaceholderPage({ title, route, purpose, checkpoint }) {
  return (
    <article className="rounded-lg border border-border bg-surface p-6 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
      <p className="text-xs font-semibold uppercase tracking-wide text-accent-saffron">
        Checkpoint {checkpoint} · placeholder
      </p>
      <h1 className="mt-2 text-2xl font-bold text-text-primary">{title}</h1>
      <p className="mt-1 font-mono text-sm text-text-secondary">{route}</p>
      <p className="mt-4 max-w-2xl text-sm leading-6 text-text-secondary">{purpose}</p>
    </article>
  );
}

PlaceholderPage.propTypes = {
  title: PropTypes.string.isRequired,
  route: PropTypes.string.isRequired,
  purpose: PropTypes.string.isRequired,
  checkpoint: PropTypes.string,
};

PlaceholderPage.defaultProps = {
  checkpoint: '1',
};
