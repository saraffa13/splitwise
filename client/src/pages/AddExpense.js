import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProjectNavigation from '../components/ProjectNavigation';
import AddExpenseForm from '../components/AddExpenseForm';
import API_URL from '../config';
import './AddExpense.css';

function AddExpense() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const response = await axios.get(`${API_URL}/projects/${id}`);
      setProject(response.data.project);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching project:', error);
      setLoading(false);
    }
  };

  const handleAddExpense = async (expenseData) => {
    try {
      await axios.post(`${API_URL}/expenses`, {
        ...expenseData,
        projectId: id
      });
      navigate(`/project/${id}/expenses`);
    } catch (error) {
      alert('Error adding expense: ' + (error.response?.data?.error || error.message));
      throw error;
    }
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

  if (project.people.length === 0) {
    return (
      <div className="page-container">
        <ProjectNavigation projectName={project.name} />
        <div className="section-card">
          <p className="empty-message">Add people first before adding expenses</p>
          <button 
            className="back-to-people-btn"
            onClick={() => navigate(`/project/${id}/people`)}
          >
            Go to People
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <ProjectNavigation projectName={project.name} />
      
      <div className="add-expense-page">
        <div className="section-card">
          <h3>Add Expense</h3>
          <AddExpenseForm 
            people={project.people}
            onAddExpense={handleAddExpense}
          />
        </div>
      </div>
    </div>
  );
}

export default AddExpense;

