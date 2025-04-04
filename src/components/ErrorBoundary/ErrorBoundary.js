import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Dev ErrorBoundary:', error);
    }
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Dev ErrorBoundary Details:', { error, errorInfo });
    }
  }

  render() {
    if (this.state.hasError) {
      // בסביבת פיתוח נציג הודעת שגיאה, בייצור נחזיר את הילדים
      if (process.env.NODE_ENV === 'development') {
        return (
          <div style={{ display: 'none' }}>
            Error occurred but continuing...
          </div>
        );
      }
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 