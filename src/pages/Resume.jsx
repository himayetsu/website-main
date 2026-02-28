import { motion } from 'framer-motion'
import { Briefcase, GraduationCap, Award, Download } from 'lucide-react'
import './Resume.css'

const experience = [
  {
    title: 'Full Stack Software Development Intern',
    company: 'eXp Realty',
    period: 'Jan 2026 - May 2026',
    description: 'stuff im adding later',
    tech: ['TypeScript', 'Golang', 'Node.js', 'Jest', 'Docket'],
  },
  {
    title: 'Software Engineering Intern',
    company: 'Upgraded Inc.',
    period: 'May 2025 - Sept 2025',
    description: 'more stuff im adding later',
    tech: ['React', 'Next.js', 'Node.js', 'Tailwind CSS'],
  },
  {
    title: 'Software Engineer',
    company: 'DataAnnotation',
    period: 'Apr 2024 - Sept 2024',
    description: 'even more stuff ill add later',
    tech: ['Java', 'C++', 'Python', 'Swift', 'Golang', 'Rust', 'SQL'],
  },
]

const education = [
  {
    title: 'Bachelor\'s degree in Computer Engineering',
    school: 'University of Waterloo',
    period: '2024 - 2029',
    description: 'Notable courses: Algorithms and Data Structures, Advanced Calculus 1 for Electrical and Computer Engineers, Digital Computers, Electronic Circuits 1, Discrete Mathematics and Logic 1, Classical Mechanics',
  },
]

const vp = { once: true, margin: '-80px' }

export default function Resume() {
  return (
    <section id="resume" className="section resume-page">
      <div className="resume-header">
        <div>
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={vp}
            transition={{ duration: 0.6 }}
          >
            Resume
          </motion.h2>
          <motion.p
            className="section-subtitle"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={vp}
            transition={{ delay: 0.1 }}
          >
            My professional journey and qualifications
          </motion.p>
        </div>
        <motion.button
          className="download-btn"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={vp}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          data-hover
        >
          <Download size={18} />
          Download PDF
        </motion.button>
      </div>

      <div className="timeline-container">
        <div className="timeline-section">
          <motion.div
            className="timeline-label"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={vp}
            transition={{ delay: 0.15 }}
          >
            <Briefcase size={20} />
            <span>Experience</span>
          </motion.div>

          <div className="timeline">
            {experience.map((exp, i) => (
              <motion.div
                key={i}
                className="timeline-item"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={vp}
                transition={{ delay: 0.2 + i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="timeline-dot" />
                <div className="timeline-content">
                  <div className="timeline-meta">
                    <span className="timeline-period">{exp.period}</span>
                    <span className="timeline-company">{exp.title}</span>
                  </div>
                  <h3 className="timeline-title">{exp.company}</h3>
                  <p className="timeline-desc">{exp.description}</p>
                  <div className="timeline-tech">
                    {exp.tech.map(t => (
                      <span key={t} className="tech-tag">{t}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="timeline-section">
          <motion.div
            className="timeline-label"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={vp}
            transition={{ delay: 0.1 }}
          >
            <GraduationCap size={20} />
            <span>Education</span>
          </motion.div>

          <div className="timeline">
            {education.map((edu, i) => (
              <motion.div
                key={i}
                className="timeline-item"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={vp}
                transition={{ delay: 0.15 + i * 0.12 }}
              >
                <div className="timeline-dot" />
                <div className="timeline-content">
                  <div className="timeline-meta">
                    <span className="timeline-period">{edu.period}</span>
                    <span className="timeline-company">{edu.title}</span>
                  </div>
                  <h3 className="timeline-title">{edu.school}</h3>
                  <p className="timeline-desc">{edu.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
     </div>
    </section>
  )
}
