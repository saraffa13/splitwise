import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProjectNavigation from '../components/ProjectNavigation';
import AddExpenseForm from '../components/AddExpenseForm';
import API_URL from '../config';
import './EditExpense.css';

function EditExpense() {
  const { id, expenseId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [id, expenseId]);

  const fetchData = async () => {
    try {
      const [projectResponse, expenseResponse] = await Promise.all([
        axios.get(`${API_URL}/projects/${id}`),
        axios.get(`${API_URL}/expenses/${expenseId}`)
      ]);
      setProject(projectResponse.data.project);
      setExpense(expenseResponse.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleUpdateExpense = async (expenseId, expenseData) => {
    try {
      await axios.put(`${API_URL}/expenses/${expenseId}`, expenseData);
      navigate(`/project/${id}/expenses`);
    } catch (error) {
      alert('Error updating expense: ' + (error.response?.data?.error || error.message));
      throw error;
    }
  };

  const handleCancel = () => {
    navigate(`/project/${id}/expenses`);
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading">Loading expense details...</div>
      </div>
    );
  }

  if (!project || !expense) {
    return (
      <div className="page-container">
        <div className="error">Project or expense not found</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <ProjectNavigation projectName={project.name} />
      
      <div className="edit-expense-page">
        <div className="section-card">
          <h3>Edit Expense</h3>
          <AddExpenseForm 
            people={project.people}
            onUpdateExpense={handleUpdateExpense}
            editingExpense={expense}
            onCancelEdit={handleCancel}
          />
        </div>
      </div>
    </div>
  );
}

export default EditExpense;

