import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Sundowner caught error:", error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.removeItem('sundowner_registrations');
    } catch {}
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#060911',
          color: '#fff',
          fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif",
          padding: '2rem',
          textAlign: 'center'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(255, 94, 0, 0.15)',
            border: '2px solid #FF5E00',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.8rem',
            marginBottom: '1.25rem',
            color: '#FF8A00'
          }}>
            🌅
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 900, letterSpacing: '1px', marginBottom: '0.5rem', color: '#fff' }}>
            SUNDOWNER 2026
          </h2>
          <p style={{ color: '#8F9CAE', maxWidth: '360px', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
            A temporary display error occurred. Tap below to reload the sunset experience.
          </p>
          <button
            onClick={this.handleReset}
            style={{
              padding: '0.85rem 1.8rem',
              background: 'linear-gradient(135deg, #FF5E00, #FF8A00)',
              color: '#fff',
              border: 'none',
              borderRadius: '999px',
              fontWeight: 800,
              fontSize: '0.92rem',
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(255, 94, 0, 0.4)'
            }}
          >
            Reload Experience
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
