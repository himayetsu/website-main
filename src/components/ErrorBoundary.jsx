import { Component } from 'react'

export default class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('App error:', error, info.componentStack)
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          fontFamily: 'system-ui, sans-serif',
          background: '#f2ebe3',
          color: '#2c2825',
        }}>
          <h1 style={{ fontSize: '1.5rem', marginBottom: 12 }}>Something went wrong</h1>
          <pre style={{
            background: 'rgba(0,0,0,0.06)',
            padding: 16,
            borderRadius: 4,
            overflow: 'auto',
            maxWidth: '100%',
            fontSize: '0.85rem',
          }}>
            {this.state.error?.message || String(this.state.error)}
          </pre>
          <p style={{ marginTop: 16, fontSize: '0.9rem', color: '#6b6259' }}>
            Check the browser console (F12) for full details.
          </p>
        </div>
      )
    }
    return this.props.children
  }
}
