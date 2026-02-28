import { useEffect, useRef, useCallback } from 'react'

export default function CustomCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const outerRef = useRef(null)
  const mouse = useRef({ x: -100, y: -100 })
  const dotPos = useRef({ x: -100, y: -100 })
  const ringPos = useRef({ x: -100, y: -100 })
  const outerPos = useRef({ x: -100, y: -100 })
  const hovering = useRef(false)
  const clicking = useRef(false)
  const raf = useRef(null)

  const animate = useCallback(() => {
    const { x: mx, y: my } = mouse.current

    dotPos.current.x += (mx - dotPos.current.x) * 0.2
    dotPos.current.y += (my - dotPos.current.y) * 0.2
    ringPos.current.x += (mx - ringPos.current.x) * 0.07
    ringPos.current.y += (my - ringPos.current.y) * 0.07
    outerPos.current.x += (mx - outerPos.current.x) * 0.03
    outerPos.current.y += (my - outerPos.current.y) * 0.03

    if (dotRef.current) {
      dotRef.current.style.transform = `translate(${dotPos.current.x}px, ${dotPos.current.y}px) translate(-50%, -50%)`
    }
    if (ringRef.current) {
      const ringScale = clicking.current ? 0.8 : 1
      const ringSize = hovering.current ? 50 : 32
      ringRef.current.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px) translate(-50%, -50%) scale(${ringScale})`
      ringRef.current.style.width = `${ringSize}px`
      ringRef.current.style.height = `${ringSize}px`
      ringRef.current.style.borderColor = hovering.current
        ? 'rgba(139, 115, 85, 0.8)'
        : 'rgba(139, 115, 85, 0.5)'
    }
    if (outerRef.current) {
      const outerScale = clicking.current ? 0.7 : 1
      const outerSize = hovering.current ? 70 : 48
      outerRef.current.style.transform = `translate(${outerPos.current.x}px, ${outerPos.current.y}px) translate(-50%, -50%) scale(${outerScale})`
      outerRef.current.style.width = `${outerSize}px`
      outerRef.current.style.height = `${outerSize}px`
    }

    raf.current = requestAnimationFrame(animate)
  }, [])

  useEffect(() => {
    const onMove = (e) => {
      mouse.current.x = e.clientX
      mouse.current.y = e.clientY
    }
    const onDown = () => { clicking.current = true }
    const onUp = () => { clicking.current = false }
    const onOver = (e) => {
      const t = e.target
      hovering.current = !!(
        t.tagName === 'A' || t.tagName === 'BUTTON' ||
        t.closest?.('a') || t.closest?.('button') || t.closest?.('[data-hover]')
      )
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    window.addEventListener('mouseover', onOver, { passive: true })
    raf.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('mouseover', onOver)
      cancelAnimationFrame(raf.current)
    }
  }, [animate])

  const base = {
    position: 'fixed',
    top: 0,
    left: 0,
    borderRadius: '50%',
    pointerEvents: 'none',
    zIndex: 99999,
    willChange: 'transform',
    transition: 'width 0.3s, height 0.3s, border-color 0.3s',
  }

  return (
    <>
      <div ref={dotRef} style={{
        ...base,
        width: 8,
        height: 8,
        background: '#8b7355',
      }} />
      <div ref={ringRef} style={{
        ...base,
        width: 32,
        height: 32,
        border: '1.5px solid rgba(139, 115, 85, 0.5)',
        zIndex: 99998,
      }} />
      <div ref={outerRef} style={{
        ...base,
        width: 48,
        height: 48,
        border: '1px solid rgba(139, 115, 85, 0.2)',
        zIndex: 99997,
      }} />
    </>
  )
}
