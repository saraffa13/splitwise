import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProjectList from '../components/ProjectList';
import CreateProject from '../components/CreateProject';
import API_URL from '../config';
import './HomePage.css';

function HomePage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
      navigate(`/project/${response.data._id}/people`);
    } catch (error) {
      alert('Error creating project: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleSelectProject = (projectId) => {
    navigate(`/project/${projectId}/people`);
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading">Loading projects...</div>
      </div>
    );
  }

  return (
    <div className="home-page">
      <header className="App-header">
        <h1>💰 Splitwise</h1>
        <p>Split expenses easily with friends</p>
      </header>
      
      <div className="page-container">
        <CreateProject onCreateProject={handleCreateProject} />
        <ProjectList 
          projects={projects} 
          onSelectProject={handleSelectProject}
          onRefresh={fetchProjects}
        />
      </div>
    </div>
  );
}

export default HomePage;

