import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProjectNavigation from '../components/ProjectNavigation';
import ExpenseList from '../components/ExpenseList';
import API_URL from '../config';
import './ProjectExpenses.css';

function ProjectExpenses() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjectDetails();
  }, [id]);

  const fetchProjectDetails = async () => {
    try {
      const response = await axios.get(`${API_URL}/projects/${id}`);
      setProject(response.data.project);
      setExpenses(response.data.expenses);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching project details:', error);
      setLoading(false);
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) {
      return;
    }
    try {
      await axios.delete(`${API_URL}/expenses/${expenseId}`);
      fetchProjectDetails();
    } catch (error) {
      alert('Error deleting expense: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleEditExpense = (expense) => {
    navigate(`/project/${id}/expenses/edit/${expense._id}`);
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
      
      <div className="project-expenses-page">
        <div className="section-card">
          <div className="section-header">
            <h3>Expenses</h3>
            <button 
              className="add-expense-btn"
              onClick={() => navigate(`/project/${id}/expenses/add`)}
            >
              ➕ Add Expense
            </button>
          </div>
          <ExpenseList 
            expenses={expenses}
            onDeleteExpense={handleDeleteExpense}
            onEditExpense={handleEditExpense}
          />
        </div>
      </div>
    </div>
  );
}

export default ProjectExpenses;

