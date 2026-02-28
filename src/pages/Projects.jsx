import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Github, ChevronRight } from 'lucide-react'
import ProjectModal from '../components/ProjectModal'
import './Projects.css'

const projects = [
  {
    id: 1,
    title: 'Graphing Calculator',
    description: 'TI-84 based graphing calculator capable of graphing any mathematical function, built using Swing in Java.',
    tags: ['Java', 'Swing'],
    color: '#8b7355',
    github: '#',
    live: '#',
    category: 'tools',
  },
  {
    id: 2,
    title: 'Running Man',
    description: 'Simple 2-dimensional shooter game programmed in Python',
    tags: ['Python', 'Pygame'],
    color: '#8b7355',
    github: '#',
    live: '#',
    category: 'web based',
  },
  {
    id: 3,
    title: 'RC Car',
    description: 'Remote controlled car with self-braking when detecting an obstacle. Reads commands using IR sensors. 4-speed gearbox.',
    tags: ['C++', 'Arduino'],
    color: '#8b7355',
    github: '#',
    live: '#',
    category: '',
  },
  {
    id: 4,
    title: 'Mirage',
    description: 'Circuit and resistor recognition using machine learning. Trains on circuit imagery for classification and analysis.',
    tags: ['Python', 'ML', 'Circuit Analysis'],
    color: '#8b7355',
    github: '#',
    live: '#',
    category: 'machine learning',
  },
  {
    id: 5,
    title: 'Solar Sim',
    description: 'N-body solar system simulator with realistic orbital mechanics. Built in C++ with OpenGL, custom camera and sphere rendering.',
    tags: ['C++', 'OpenGL', 'GLM', 'Physics'],
    color: '#8b7355',
    github: '#',
    live: '#',
    category: 'simulation',
  },
  {
    id: 6,
    title: 'Planetoids',
    description: 'Browser-based asteroid field game with configurable physics and visuals. Canvas-based rendering with a settings panel.',
    tags: ['JavaScript', 'Canvas', 'HTML/CSS'],
    color: '#8b7355',
    github: '#',
    live: '#',
    category: 'games',
  },
  {
    id: 7,
    title: 'Jello',
    description: 'Web-based wave simulator with a level-of-detail (LOD) system. Real-time surface deformation using Three.js and WebGL.',
    tags: ['JavaScript', 'Three.js', 'WebGL', 'OrbitControls'],
    color: '#8b7355',
    github: '#',
    live: 'https://himayetsu.github.io/Jello/',
    category: 'web based',
  },
  {
    id: 8,
    title: 'Randoweb',
    description: 'Random website generator powered by LLMs. Generates HTML/CSS and optional server from a seed; supports multiple providers.',
    tags: ['Node.js', 'LLM', 'CSS Generator'],
    color: '#8b7355',
    github: '#',
    live: '#',
    category: 'tools',
  },
  {
    id: 9,
    title: 'Google Sphere',
    description: 'Recreation of the Chrome Experiment Google Sphere. 3D interactive sphere with CSS/JS 3D transforms and custom camera.',
    tags: ['JavaScript', '3D', 'CSS Transforms'],
    color: '#8b7355',
    github: '#',
    live: '#',
    category: 'web based',
  },
  {
    id: 10,
    title: '2048 NN',
    description: '2048 game with a neural network agent. Deep Q-learning with PyTorch (LibTorch), replay buffer, and SDL2 rendering.',
    tags: ['C++', 'PyTorch', 'SDL2', 'Reinforcement Learning'],
    color: '#8b7355',
    github: '#',
    live: '#',
    category: 'machine learning',
  },
  {
    id: 11,
    title: 'ArmorSim 3D',
    description: '3D armor penetration simulation with Lanz-Odermatt and De Marre equations, spalling, and layer-by-layer armor editor.',
    tags: ['Python', 'PyQt5', 'PyQtGraph', 'Physics'],
    color: '#8b7355',
    github: '#',
    live: '#',
    category: 'simulation',
  },
  {
    id: 12,
    title: 'File Encoding',
    description: 'Lossless audio compressor: WAV to custom .9f format using Huffman coding. Rust CLI with encode, decode, and play.',
    tags: ['Rust', 'Huffman', 'CLI', 'Rodio'],
    color: '#8b7355',
    github: '#',
    live: '#',
    category: 'tools',
  },
  {
    id: 13,
    title: 'Aurora',
    description: 'Real-time collaborative particle universe. Create stars, planets, nebulae in 3D with others; PostgreSQL and WebSockets.',
    tags: ['React', 'Three.js', 'Prisma', 'Socket.io', 'PostgreSQL'],
    color: '#8b7355',
    github: '#',
    live: '#',
    category: 'fullstack',
  },
  {
    id: 14,
    title: 'OCR Translator',
    description: 'Chrome extension: translate selected text or run OCR on images (OCR.space) and show English translation via Lingva.',
    tags: ['Chrome Extension', 'OCR', 'Translation', 'JavaScript'],
    color: '#8b7355',
    github: '#',
    live: '#',
    category: 'tools',
  },
]

const categories = ['all', 'fullstack', 'simulation', 'web based', 'games', 'tools', 'machine learning']

export default function Projects() {
  const [filter, setFilter] = useState('all')
  const [modalProject, setModalProject] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)

  const filtered = useMemo(
    () => filter === 'all' ? projects : projects.filter(p => p.category === filter),
    [filter]
  )

  const openModal = (project) => {
    setModalProject(project)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setModalProject(null)
  }

  return (
    <section id="projects" className="section projects-page">
      <h2 className="section-title">Projects</h2>
      <p className="section-subtitle">
        A collection of programs I've designed and built
      </p>

      <div className="filter-bar">
        {categories.map(cat => (
          <button
            key={cat}
            className={`filter-btn ${filter === cat ? 'active' : ''}`}
            onClick={() => setFilter(cat)}
            data-hover
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="projects-grid">
        {filtered.map((project, i) => (
          <div
            key={project.id}
            className="project-card"
            style={{
              '--card-accent': project.color,
              animationDelay: `${i * 0.04}s`,
            }}
          >
            <div className="card-header">
              <div className="card-number" style={{ color: project.color }}>
                {String(project.id).padStart(2, '0')}
              </div>
              <div className="card-links">
                <a href={project.github} data-hover className="card-link" target="_blank" rel="noopener noreferrer">
                  <Github size={18} />
                </a>
                <a href={project.live} data-hover className="card-link" target="_blank" rel="noopener noreferrer">
                  <ExternalLink size={18} />
                </a>
              </div>
            </div>

            <h3 className="card-title">{project.title}</h3>
            <p className="card-desc">{project.description}</p>

            <div className="card-tags">
              {project.tags.map(tag => (
                <span key={tag} className="card-tag">{tag}</span>
              ))}
            </div>

            <button
              type="button"
              className="card-footer"
              onClick={() => openModal(project)}
              data-hover
            >
              <span>View Details</span>
              <ChevronRight size={16} />
            </button>
          </div>
        ))}
      </div>

      <ProjectModal
        project={modalProject}
        open={modalOpen}
        onClose={closeModal}
      />
    </section>
  )
}
