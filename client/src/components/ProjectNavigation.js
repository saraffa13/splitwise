import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import './ProjectNavigation.css';

function ProjectNavigation({ projectName }) {
  const { id } = useParams();
  const location = useLocation();

  const navItems = [
    { path: `/project/${id}/people`, label: 'People', icon: '👥' },
    { path: `/project/${id}/expenses`, label: 'Expenses', icon: '💰' },
    { path: `/project/${id}/expenses/add`, label: 'Add Expense', icon: '➕' }
  ];

  return (
    <nav className="project-navigation">
      <div className="nav-header">
        <Link to="/" className="back-link">← Back to Projects</Link>
        <h2 className="project-title">{projectName}</h2>
      </div>
      <div className="nav-tabs">
        {navItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-tab ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}

export default ProjectNavigation;

