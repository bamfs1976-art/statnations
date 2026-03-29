import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>⚠</div>
          <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 8 }}>
            {this.props.title || 'Something went wrong'}
          </h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
            {this.state.error.message}
          </p>
          <button
            className="tab-btn active"
            style={{ display: 'inline-flex', flex: 'none', padding: '8px 24px', cursor: 'pointer' }}
            onClick={() => this.setState({ error: null })}
          >
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
