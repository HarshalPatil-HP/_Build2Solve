import PropTypes from 'prop-types';

const PATHS = {
  home: 'M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9.5Z',
  scan: 'M4 7V5a1 1 0 0 1 1-1h2M4 17v2a1 1 0 0 0 1 1h2M16 4h2a1 1 0 0 1 1 1v2M18 20h-2a1 1 0 0 1-1-1v-2M8 12h8M12 8v8',
  clock: 'M12 7v5l3 2m6-2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
  flag: 'M5 4v16M5 5h10l-1.5 3L15 11H5',
  bell: 'M6 9a6 6 0 1 1 12 0c0 7 3 7 3 7H3s3 0 3-7Zm6 11a2 2 0 0 0 2-2H10a2 2 0 0 0 2 2Z',
  user: 'M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-4 0-8 2-8 5v1h16v-1c0-3-4-5-8-5Z',
  box: 'M4 8l8-4 8 4-8 4-8-4Zm0 0v8l8 4 8-4V8',
  users: 'M16 11a3 3 0 1 0-3-3 3 3 0 0 0 3 3ZM8 12a3 3 0 1 0-3-3 3 3 0 0 0 3 3Zm8 2c-2.7 0-5 1.2-5 3v1h10v-1c0-1.8-2.3-3-5-3ZM8 14c-3 0-6 1.5-6 3.5V19h6',
  building: 'M5 21V5h10v16M9 9h2M9 13h2M9 17h2M15 21h4V11h-4',
  folder: 'M4 7h6l2 2h8v10H4V7Z',
  map: 'M4 6l5-2 6 2 5-2v14l-5 2-6-2-5 2V6Zm5-2v14m6-12v14',
  cloud: 'M7 17h10a4 4 0 0 0 0-8 6 6 0 0 0-11.5 1.5A3.5 3.5 0 0 0 7 17Z',
  badge: 'M12 3 8 5v4c0 4 2.5 6.5 4 7.5 1.5-1 4-3.5 4-7.5V5l-4-2Z',
  scale: 'M12 4v16M6 8h12M6 8l-3 6h6L6 8Zm12 0 3 6h-6l3-6Z',
  file: 'M7 4h7l4 4v12H7V4Zm7 0v4h4',
  list: 'M8 7h12M8 12h12M8 17h12M4 7h.01M4 12h.01M4 17h.01',
};

export default function NavIcon({ name, className = 'h-5 w-5' }) {
  const d = PATHS[name] || PATHS.home;
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d={d} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

NavIcon.propTypes = {
  name: PropTypes.string.isRequired,
  className: PropTypes.string,
};
