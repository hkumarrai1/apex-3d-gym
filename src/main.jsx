import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

class GlobalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Global Error Boundary caught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', background: '#0a0a0c', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif' }}>
          <h2 style={{ color: '#00f0ff' }}>APEX 3D Gym Platform Diagnostic</h2>
          <p style={{ color: '#ff0055' }}>Error: {this.state.error && this.state.error.toString()}</p>
          <button
            onClick={() => window.location.reload()}
            style={{ padding: '10px 20px', background: '#00f0ff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Reload Gym App
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <GlobalErrorBoundary>
    <App />
  </GlobalErrorBoundary>
);
