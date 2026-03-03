import { motion } from 'framer-motion'
import { getCompletedProjectsCount } from '../data/projects'
import './About.css'

// Fill colour from site accent: low level = pale/gray, high level = saturated brown
function skillFillColor(level) {
  const hue = 28
  const sat = 4 + (level / 100) * 34   // 4% (nearly gray) → 38% (rich)
  const light = 70 - (level / 100) * 26 // 70% (light) → 44% (accent)
  return `hsl(${hue}, ${sat}%, ${light}%)`
}

// Programming/markup languages (default colour); everything else = technology (accent)
const LANGUAGES = new Set([
  'java', 'python', 'c++', 'c#', 'javascript', 'typescript', 'html', 'css', 'sql',
  'assembly', 'golang', 'swift', 'rust',
])

function renderSkillName(name) {
  const parts = name.split(',').map((term, i) => {
    const t = term.trim()
    const isTech = t && !LANGUAGES.has(t.toLowerCase())
    return isTech ? (
      <span key={i} className="skill-name-tech">{t}</span>
    ) : (
      <span key={i}>{t}</span>
    )
  })
  return parts.reduce((acc, el, i) => (i === 0 ? [el] : [...acc, ', ', el]), [])
}

const skills = [
  { name: 'Java, Python, C++, C#, Javascript', level: 100, experience: '6+ years' },
  { name: 'HTML, CSS, WebGL, React, SQL', level: 70, experience: '4+ years' },
  { name: 'pytesseract, Three.js, Node.js', level: 55, experience: '3+ years' },
  { name: 'Typescript, SQL, OpenGL', level: 40, experience: '2+ years' },
  { name: 'Assembly, Golang, Swift, Tensorflow', level: 25, experience: '1+ years' },
]

const stats = [
  { label: 'Professional experience', value: '2+ years' },
  { label: 'Projects completed', value: String(getCompletedProjectsCount()) },
]

const vp = { once: true, margin: '-100px' }

export default function About() {
  return (
    <section id="about" className="section about-page">
      <motion.h2
        className="section-title"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={vp}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        About Me
      </motion.h2>

      <div className="about-grid">
        <motion.div
          className="about-bio"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={vp}
          transition={{ delay: 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="bio-card">
            <div className="bio-avatar">
              <div className="avatar-placeholder">
                <span>HL</span>
              </div>
            </div>
            <h3>Hello!</h3>
            <p>
              I'm a software developer currently studying Computer Engineering at the University of Waterloo with many years of experience in full stack development, graphics engineering, and optimization. 
              My interests include Neural Networks, Game Development, and Simulations.
            </p>
            <p>
              I also enjoy doing writing, drawing art, and learning about cool physics/mathematics concepts that make the world feel precise.
            </p>
            <div className="bio-tags-spacer">
              <div className="bio-tags">
                <span className="bio-tag">Full stack (React, Next.js)</span>
              <span className="bio-tag">Graphics (OpenGL, Three.js)</span>
              <span className="bio-tag">Machine learning (Tensorflow, PyTorch)</span>
              <span className="bio-tag">Physics & Simulations</span>
              <span className="bio-tag">Systems (C++, Rust)</span>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="about-right">
          <motion.div
            className="about-skills"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={vp}
            transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <h3 className="skills-title">
              <span>Languages/</span>
              <span className="skills-title-tech">Technologies</span>
            </h3>
            <div className="skills-list">
              {skills.map((skill, i) => (
                <motion.div
                  key={skill.name}
                  className="skill-item"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={vp}
                  transition={{ delay: 0.3 + i * 0.08 }}
                >
                  <div className="skill-header">
                    <span className="skill-name">{renderSkillName(skill.name)}</span>
                  </div>
                  <div className="skill-bar-row">
                    <div className="skill-bar">
                      <div
                        className="skill-fill"
                        style={{
                          width: `${skill.level}%`,
                          backgroundColor: skillFillColor(skill.level),
                        }}
                      />
                    </div>
                    <span className="skill-experience">{skill.experience}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className="about-stats">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="stat-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={vp}
                transition={{ delay: 0.25 + i * 0.1 }}
                whileHover={{ y: -4, borderColor: 'rgba(139, 115, 85, 0.4)' }}
              >
                <span className="stat-value">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
