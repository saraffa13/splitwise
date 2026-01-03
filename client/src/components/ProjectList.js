import React from 'react';
import './ProjectList.css';

function ProjectList({ projects, onSelectProject, onRefresh }) {
  if (projects.length === 0) {
    return (
      <div className="empty-state">
        <p>No projects yet. Create one to get started!</p>
      </div>
    );
  }

  return (
    <div className="project-list">
      <div className="project-list-header">
        <h2>Your Projects</h2>
        <button onClick={onRefresh} className="refresh-btn">Refresh</button>
      </div>
      <div className="projects-grid">
        {projects.map(project => (
          <div 
            key={project._id} 
            className="project-card"
            onClick={() => onSelectProject(project._id)}
          >
            <h3>{project.name}</h3>
            <p className="project-meta">
              {project.people.length} {project.people.length === 1 ? 'person' : 'people'}
            </p>
            <p className="project-date">
              Created: {new Date(project.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProjectList;

