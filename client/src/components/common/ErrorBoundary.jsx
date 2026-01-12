import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Minimalny monitoring: log w konsoli.
    console.error('UI error boundary:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="page-container">
          <div className="error-message">
            Wystapil blad w interfejsie. Odswiez strone i sproboj ponownie.
          </div>
          <button
            type="button"
            className="btn-primary"
            onClick={() => window.location.reload()}
          >
            Odswiez
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
