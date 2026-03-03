import { useState, useMemo } from 'react'
import { ExternalLink, Github, ChevronRight } from 'lucide-react'
import ProjectModal from '../components/ProjectModal'
import { completedProjects, inProgressProjects } from '../data/projects'
import './Projects.css'

function getCategories(p) {
  const c = p.categories ?? p.category
  return Array.isArray(c) ? c.filter(Boolean) : c ? [c] : []
}

const allProjects = [...completedProjects, ...inProgressProjects]
const categories = ['all', ...[...new Set(allProjects.flatMap((p) => getCategories(p)))].sort()]

const cardLinks = (project) => (
  <div className="card-links">
    <a href={project.github} data-hover className="card-link" target="_blank" rel="noopener noreferrer">
      <Github size={18} />
    </a>
    <a href={project.live} data-hover className="card-link" target="_blank" rel="noopener noreferrer">
      <ExternalLink size={18} />
    </a>
  </div>
)

function ProjectCard({ project, index, onViewDetails, showId = true }) {
  return (
    <div
      className="project-card"
      style={{ '--card-accent': project.color, animationDelay: `${index * 0.04}s` }}
    >
      {showId ? (
        <div className="card-header">
          <div className="card-number" style={{ color: project.color }}>
            {String(project.id).padStart(2, '0')}
          </div>
          {cardLinks(project)}
        </div>
      ) : (
        <div className="card-title-row">
          <h3 className="card-title">{project.title}</h3>
          {cardLinks(project)}
        </div>
      )}
      {showId && <h3 className="card-title">{project.title}</h3>}
      <p className="card-desc">{project.description}</p>
      <div className="card-tags">
        {project.tags.map((tag) => (
          <span key={tag} className="card-tag">{tag}</span>
        ))}
      </div>
      <button type="button" className="card-footer" onClick={onViewDetails} data-hover>
        <span>View Details</span>
        <ChevronRight size={16} />
      </button>
    </div>
  )
}

export default function Projects() {
  const [filter, setFilter] = useState('all')
  const [modalProject, setModalProject] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)

  const filtered = useMemo(
    () => filter === 'all' ? completedProjects : completedProjects.filter((p) => getCategories(p).includes(filter)),
    [filter]
  )

  const filteredInProgress = useMemo(
    () => filter === 'all' ? inProgressProjects : inProgressProjects.filter((p) => getCategories(p).includes(filter)),
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
          <ProjectCard key={project.id} project={project} index={i} onViewDetails={() => openModal(project)} />
        ))}
      </div>

      {filteredInProgress.length > 0 && (
        <>
          <h3 className="projects-subsection-title">In progress</h3>
          <div className="projects-grid in-progress-grid">
            {filteredInProgress.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} onViewDetails={() => openModal(project)} showId={false} />
            ))}
          </div>
        </>
      )}

      <ProjectModal
        project={modalProject}
        open={modalOpen}
        onClose={closeModal}
      />
    </section>
  )
}
