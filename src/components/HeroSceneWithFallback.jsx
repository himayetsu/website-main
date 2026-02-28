import { Component } from 'react'
import HeroScene from './HeroScene'

export default class HeroSceneWithFallback extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            width: '100%',
            height: '100vh',
            position: 'absolute',
            top: 0,
            left: 0,
            background: 'linear-gradient(180deg, #f2ebe3 0%, #e8e0d5 100%)',
          }}
        />
      )
    }
    return <HeroScene />
  }
}
