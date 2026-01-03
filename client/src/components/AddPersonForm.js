import React, { useState } from 'react';
import './AddPersonForm.css';

function AddPersonForm({ onAddPerson }) {
  const [personName, setPersonName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!personName.trim()) {
      alert('Please enter a person name');
      return;
    }

    setIsAdding(true);
    try {
      await onAddPerson(personName.trim());
      setPersonName('');
    } catch (error) {
      console.error('Error adding person:', error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-person-form">
      <input
        type="text"
        placeholder="Enter person name"
        value={personName}
        onChange={(e) => setPersonName(e.target.value)}
        className="person-name-input"
        disabled={isAdding}
      />
      <button 
        type="submit" 
        className="add-person-btn"
        disabled={isAdding || !personName.trim()}
      >
        {isAdding ? 'Adding...' : 'Add Person'}
      </button>
    </form>
  );
}

export default AddPersonForm;

