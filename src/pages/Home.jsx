import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import HeroSceneWithFallback from '../components/HeroSceneWithFallback'
import './Home.css'

const TYPE_SPEED = 90
const DELETE_SPEED = 55
const PAUSE_BEFORE_DELETE = 2200
const PAUSE_BEFORE_TYPE = 400

const names = ['Henry Li', 'himayetsu', 'henry li', 'himetsu']

function useTypewriter() {
  const [displayed, setDisplayed] = useState('')
  const [nameIdx, setNameIdx] = useState(0)
  const [phase, setPhase] = useState('waiting')

  const tick = useCallback(() => {
    const current = names[nameIdx]

    if (phase === 'waiting') {
      return
    }

    if (phase === 'typing') {
      if (displayed.length < current.length) {
        setDisplayed(current.slice(0, displayed.length + 1))
      } else {
        setPhase('pausing')
      }
      return
    }

    if (phase === 'pausing') {
      return
    }

    if (phase === 'deleting') {
      if (displayed.length > 0) {
        setDisplayed(displayed.slice(0, -1))
      } else {
        setNameIdx((nameIdx + 1) % names.length)
        setPhase('gap')
      }
      return
    }

    if (phase === 'gap') {
      setPhase('typing')
      return
    }
  }, [displayed, nameIdx, phase])

  useEffect(() => {
    const startTimer = setTimeout(() => setPhase('typing'), 800)
    return () => clearTimeout(startTimer)
  }, [])

  useEffect(() => {
    if (phase === 'waiting') return

    if (phase === 'pausing') {
      const t = setTimeout(() => setPhase('deleting'), PAUSE_BEFORE_DELETE)
      return () => clearTimeout(t)
    }

    if (phase === 'gap') {
      const t = setTimeout(() => tick(), PAUSE_BEFORE_TYPE)
      return () => clearTimeout(t)
    }

    const speed = phase === 'deleting' ? DELETE_SPEED : TYPE_SPEED
    const t = setTimeout(tick, speed)
    return () => clearTimeout(t)
  }, [tick, phase])

  return displayed
}

export default function Home() {
  const typed = useTypewriter()

  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="home" className="home">
      <HeroSceneWithFallback />

      <div className="hero-content">
        <motion.div
          className="hero-tag"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <span className="tag-dot" />
        </motion.div>

        <motion.h1
          className="hero-title"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="gradient-text">{typed}</span>
          <span className="type-cursor">|</span>
        </motion.h1>

        <motion.p
          className="hero-subtitle"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.7 }}
        >
          Software developer seeking bold opportunities
        </motion.p>

        <motion.div
          className="hero-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          <button onClick={() => scrollTo('projects')} className="btn-primary" data-hover>
            View Projects
          </button>
          <button onClick={() => scrollTo('contact')} className="btn-secondary" data-hover>
            Get in Touch
          </button>
        </motion.div>
      </div>

      <motion.div
        className="scroll-indicator"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        onClick={() => scrollTo('about')}
        style={{ cursor: 'none' }}
      >
        <div className="scroll-line" />
        <span>Scroll down</span>
      </motion.div>
    </section>
  )
}
