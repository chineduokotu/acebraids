import React from 'react';

/**
 * Full-page loading spinner shown while lazy route chunks are fetched.
 * Matches the site's dark background so there's no flash of white.
 */
export const PageLoader = () => (
  <div
    aria-label="Loading page"
    role="status"
    style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0a0a0a',
    }}
  >
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      style={{ animation: 'spin 0.8s linear infinite' }}
    >
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <circle cx="24" cy="24" r="20" stroke="#2a2a2a" strokeWidth="4" />
      <path
        d="M44 24a20 20 0 0 0-20-20"
        stroke="#e91e8c"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  </div>
);

export default PageLoader;
