import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Mail, MapPin, Github, Linkedin, Twitter, Instagram, MessageCircle, Code } from 'lucide-react'
import './Contact.css'

const socials = [
  { icon: Github, label: 'GitHub', href: '#' },
  { icon: Linkedin, label: 'LinkedIn', href: '#' },
  { icon: Instagram, label: 'Instagram', href: '#' },
  { icon: MessageCircle, label: 'Discord', href: '#' },
  { icon: Code, label: 'LeetCode', href: '#' },
]

const vp = { once: true, margin: '-80px' }

export default function Contact() {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
    setTimeout(() => setSent(false), 3000)
    setFormState({ name: '', email: '', message: '' })
  }

  return (
    <section id="contact" className="section contact-page">
      <motion.h2
        className="section-title"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={vp}
        transition={{ duration: 0.6 }}
      >
        Get in Touch
      </motion.h2>
      <motion.p
        className="section-subtitle"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={vp}
        transition={{ delay: 0.1 }}
      >
        Recruiter or want to work together? Email me!
      </motion.p>

      <div className="contact-grid">
        <motion.form
          className="contact-form"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={vp}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="form-group">
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-input"
              placeholder=""
              value={formState.name}
              onChange={e => setFormState(s => ({ ...s, name: e.target.value }))}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              placeholder=""
              value={formState.email}
              onChange={e => setFormState(s => ({ ...s, email: e.target.value }))}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Message</label>
            <textarea
              className="form-textarea"
              placeholder=""
              rows={5}
              value={formState.message}
              onChange={e => setFormState(s => ({ ...s, message: e.target.value }))}
              required
            />
          </div>

          <motion.button
            type="submit"
            className={`submit-btn ${sent ? 'sent' : ''}`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            data-hover
          >
            {sent ? (
              <>Sent!</>
            ) : (
              <>
                <Send size={18} />
                Send Message
              </>
            )}
          </motion.button>
        </motion.form>

        <motion.div
          className="contact-info"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={vp}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="info-card">
            <h3>Let's create something amazing</h3>
            <p>
              I'm always open to discussing new projects, creative ideas,
              or opportunities to be part of your vision.
            </p>
          </div>
          <div className="contact-list-card">
            <h3 className="contact-list-title">Contact</h3>
            <ul className="contact-list">
              <li className="contact-list-item">
                <Mail size={18} aria-hidden />
                <a href="mailto:galacticfrosting@gmail.com">galacticfrosting@gmail.com</a>
              </li>
              {socials.map((social) => (
                <li key={social.label} className="contact-list-item">
                  <social.icon size={18} aria-hidden />
                  <a href={social.href} target="_blank" rel="noopener noreferrer" data-hover>
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>

      <motion.footer
        className="site-footer"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={vp}
        transition={{ delay: 0.6 }}
      >
        <p>{new Date().getFullYear()} Personal Website, built with React & Three.js.</p>
      </motion.footer>
    </section>
  )
}
