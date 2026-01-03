import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import ProjectList from './components/ProjectList';
import ProjectDetail from './components/ProjectDetail';
import CreateProject from './components/CreateProject';
import API_URL from './config';

function App() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${API_URL}/projects`);
      setProjects(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setLoading(false);
    }
  };

  const handleCreateProject = async (projectName) => {
    try {
      const response = await axios.post(`${API_URL}/projects`, { name: projectName });
      setProjects([...projects, response.data]);
      setSelectedProject(response.data._id);
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Error creating project: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleSelectProject = (projectId) => {
    setSelectedProject(projectId);
  };

  const handleBackToList = () => {
    setSelectedProject(null);
    fetchProjects();
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>💰 Splitwise</h1>
        <p>Split expenses easily with friends</p>
      </header>
      
      <main className="App-main">
        {selectedProject ? (
          <ProjectDetail 
            projectId={selectedProject} 
            onBack={handleBackToList}
            onUpdate={fetchProjects}
          />
        ) : (
          <>
            <CreateProject onCreateProject={handleCreateProject} />
            <ProjectList 
              projects={projects} 
              onSelectProject={handleSelectProject}
              onRefresh={fetchProjects}
            />
          </>
        )}
      </main>
    </div>
  );
}

export default App;
