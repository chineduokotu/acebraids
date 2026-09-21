import React from 'react';

/**
 * React error boundary — catches render-time errors anywhere in the subtree.
 * Shows a friendly recovery UI instead of a blank screen.
 * Extensible: swap console.error for a Sentry call if you add it later.
 */
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error('[ErrorBoundary] Uncaught error:', error, info.componentStack);
    // To add Sentry: Sentry.captureException(error, { extra: info });
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div
        role="alert"
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0a0a0a',
          color: '#f5f5f5',
          fontFamily: 'Inter, sans-serif',
          padding: '2rem',
          textAlign: 'center',
          gap: '1rem',
        }}
      >
        <div style={{ fontSize: '3rem' }}>⚠️</div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>
          Something went wrong
        </h1>
        <p style={{ color: '#a3a3a3', maxWidth: '40ch', margin: 0 }}>
          An unexpected error occurred. Please reload the page — your cart is saved.
        </p>
        <button
          onClick={this.handleReload}
          style={{
            marginTop: '1rem',
            padding: '0.75rem 2rem',
            background: '#e91e8c',
            color: '#fff',
            border: 'none',
            borderRadius: '9999px',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer',
            letterSpacing: '0.05em',
          }}
        >
          Reload Page
        </button>
        {process.env.NODE_ENV !== 'production' && this.state.error && (
          <pre
            style={{
              marginTop: '1rem',
              fontSize: '0.75rem',
              color: '#ef4444',
              textAlign: 'left',
              maxWidth: '80ch',
              overflow: 'auto',
              background: '#1a1a1a',
              padding: '1rem',
              borderRadius: '0.5rem',
            }}
          >
            {this.state.error.toString()}
          </pre>
        )}
      </div>
    );
  }
}

export default ErrorBoundary;
