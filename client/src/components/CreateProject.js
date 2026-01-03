import React, { useState } from 'react';
import './CreateProject.css';

function CreateProject({ onCreateProject }) {
  const [projectName, setProjectName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!projectName.trim()) {
      alert('Please enter a project name');
      return;
    }

    setIsCreating(true);
    try {
      await onCreateProject(projectName.trim());
      setProjectName('');
    } catch (error) {
      console.error('Error creating project:', error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="create-project">
      <form onSubmit={handleSubmit} className="create-project-form">
        <input
          type="text"
          placeholder="Enter project name (e.g., 'Trip to Paris')"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className="project-name-input"
          disabled={isCreating}
        />
        <button 
          type="submit" 
          className="create-btn"
          disabled={isCreating || !projectName.trim()}
        >
          {isCreating ? 'Creating...' : 'Create Project'}
        </button>
      </form>
    </div>
  );
}

export default CreateProject;

