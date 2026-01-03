import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ProjectNavigation from '../components/ProjectNavigation';
import AddPersonForm from '../components/AddPersonForm';
import BalanceDisplay from '../components/BalanceDisplay';
import PersonDetail from '../components/PersonDetail';
import API_URL from '../config';
import './ProjectPeople.css';

function ProjectPeople() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [balances, setBalances] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedPerson, setSelectedPerson] = useState(null);

  useEffect(() => {
    fetchProjectDetails();
  }, [id]);

  const fetchProjectDetails = async () => {
    try {
      const response = await axios.get(`${API_URL}/projects/${id}`);
      setProject(response.data.project);
      setBalances(response.data.balances);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching project details:', error);
      setLoading(false);
    }
  };

  const handleAddPerson = async (personName) => {
    try {
      await axios.post(`${API_URL}/projects/${id}/people`, { name: personName });
      fetchProjectDetails();
    } catch (error) {
      alert('Error adding person: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleDeletePerson = async (personId) => {
    if (!window.confirm('Are you sure you want to remove this person?')) {
      return;
    }
    try {
      await axios.delete(`${API_URL}/projects/${id}/people/${personId}`);
      fetchProjectDetails();
    } catch (error) {
      alert('Error deleting person: ' + (error.response?.data?.error || error.message));
    }
  };

  const handlePersonClick = (personName) => {
    setSelectedPerson(personName);
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading">Loading project details...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="page-container">
        <div className="error">Project not found</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <ProjectNavigation projectName={project.name} />
      
      <div className="project-people-page">
        <div className="people-section">
          <div className="section-card">
            <h3>People</h3>
            <AddPersonForm onAddPerson={handleAddPerson} />
            <div className="people-list">
              {project.people.length === 0 ? (
                <p className="empty-message">No people added yet. Add someone to get started!</p>
              ) : (
                project.people.map(person => (
                  <div key={person._id} className="person-item">
                    <span className="person-name">{person.name}</span>
                    <button 
                      onClick={() => handleDeletePerson(person._id)}
                      className="delete-btn"
                    >
                      ×
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="balances-section">
          <div className="section-card">
            <h3>Balances</h3>
            <BalanceDisplay 
              balances={balances}
              onPersonClick={handlePersonClick}
            />
          </div>
        </div>
      </div>

      {selectedPerson && (
        <PersonDetail
          personName={selectedPerson}
          projectId={id}
          onClose={() => setSelectedPerson(null)}
        />
      )}
    </div>
  );
}

export default ProjectPeople;

