import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProjectDetail.css';
import AddPersonForm from './AddPersonForm';
import AddExpenseForm from './AddExpenseForm';
import ExpenseList from './ExpenseList';
import BalanceDisplay from './BalanceDisplay';
import PersonDetail from './PersonDetail';
import API_URL from '../config';

function ProjectDetail({ projectId, onBack, onUpdate }) {
  const [project, setProject] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState({});
  const [loading, setLoading] = useState(true);
  const [editingExpense, setEditingExpense] = useState(null);
  const [selectedPerson, setSelectedPerson] = useState(null);

  useEffect(() => {
    fetchProjectDetails();
  }, [projectId]);

  const fetchProjectDetails = async () => {
    try {
      const response = await axios.get(`${API_URL}/projects/${projectId}`);
      setProject(response.data.project);
      setExpenses(response.data.expenses);
      setBalances(response.data.balances);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching project details:', error);
      setLoading(false);
    }
  };

  const handleAddPerson = async (personName) => {
    try {
      await axios.post(`${API_URL}/projects/${projectId}/people`, { name: personName });
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
      await axios.delete(`${API_URL}/projects/${projectId}/people/${personId}`);
      fetchProjectDetails();
    } catch (error) {
      alert('Error deleting person: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleAddExpense = async (expenseData) => {
    try {
      await axios.post(`${API_URL}/expenses`, {
        ...expenseData,
        projectId
      });
      fetchProjectDetails();
    } catch (error) {
      alert('Error adding expense: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) {
      return;
    }
    try {
      await axios.delete(`${API_URL}/expenses/${expenseId}`);
      setEditingExpense(null);
      fetchProjectDetails();
    } catch (error) {
      alert('Error deleting expense: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    // Scroll to expense form
    setTimeout(() => {
      const formElement = document.querySelector('.add-expense-form');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleUpdateExpense = async (expenseId, expenseData) => {
    try {
      await axios.put(`${API_URL}/expenses/${expenseId}`, expenseData);
      setEditingExpense(null);
      fetchProjectDetails();
    } catch (error) {
      alert('Error updating expense: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleCancelEdit = () => {
    setEditingExpense(null);
  };

  const handlePersonClick = (personName) => {
    setSelectedPerson(personName);
  };

  if (loading) {
    return <div className="loading">Loading project details...</div>;
  }

  if (!project) {
    return <div className="error">Project not found</div>;
  }

  return (
    <div className="project-detail">
      <div className="project-detail-header">
        <button onClick={onBack} className="back-btn">← Back to Projects</button>
        <h2>{project.name}</h2>
      </div>

      <div className="project-detail-content">
        <div className="left-panel">
          <div className="section">
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

          <div className="section">
            <h3>{editingExpense ? 'Edit Expense' : 'Add Expense'}</h3>
            {project.people.length === 0 ? (
              <p className="empty-message">Add people first before adding expenses</p>
            ) : (
              <AddExpenseForm 
                people={project.people}
                onAddExpense={handleAddExpense}
                onUpdateExpense={handleUpdateExpense}
                editingExpense={editingExpense}
                onCancelEdit={handleCancelEdit}
              />
            )}
          </div>
        </div>

        <div className="right-panel">
          <div className="section">
            <h3>Balances</h3>
            <BalanceDisplay 
              balances={balances}
              onPersonClick={handlePersonClick}
            />
          </div>

          <div className="section">
            <h3>Expenses</h3>
            <ExpenseList 
              expenses={expenses}
              onDeleteExpense={handleDeleteExpense}
              onEditExpense={handleEditExpense}
            />
          </div>
        </div>
      </div>

      {selectedPerson && (
        <PersonDetail
          personName={selectedPerson}
          projectId={projectId}
          onClose={() => setSelectedPerson(null)}
        />
      )}
    </div>
  );
}

export default ProjectDetail;

