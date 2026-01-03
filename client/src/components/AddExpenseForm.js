import React, { useState, useEffect } from 'react';
import './AddExpenseForm.css';

function AddExpenseForm({ people, onAddExpense, onUpdateExpense, editingExpense, onCancelEdit }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState('');
  const [splitAmong, setSplitAmong] = useState([]);
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingExpense) {
      setDescription(editingExpense.description);
      setAmount(editingExpense.amount.toString());
      setPaidBy(editingExpense.paidBy);
      setSplitAmong(editingExpense.splitAmong);
      // Set date from expenseDate or createdAt
      const date = editingExpense.expenseDate 
        ? new Date(editingExpense.expenseDate).toISOString().split('T')[0]
        : new Date(editingExpense.createdAt).toISOString().split('T')[0];
      setExpenseDate(date);
    } else {
      // Reset form when not editing
      setDescription('');
      setAmount('');
      setPaidBy('');
      setSplitAmong([]);
      setExpenseDate(new Date().toISOString().split('T')[0]);
    }
  }, [editingExpense]);

  const handleSplitToggle = (personName) => {
    if (splitAmong.includes(personName)) {
      setSplitAmong(splitAmong.filter(name => name !== personName));
    } else {
      setSplitAmong([...splitAmong, personName]);
    }
  };

  const handleSelectAll = () => {
    if (splitAmong.length === people.length) {
      setSplitAmong([]);
    } else {
      setSplitAmong(people.map(p => p.name));
    }
  };

  const handleSelectFirstThree = () => {
    const firstThree = people.slice(0, 3).map(p => p.name);
    setSplitAmong(firstThree);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!description.trim()) {
      alert('Please enter a description');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (!paidBy) {
      alert('Please select who paid');
      return;
    }

    if (splitAmong.length === 0) {
      alert('Please select at least one person to split the expense');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingExpense) {
        await onUpdateExpense(editingExpense._id, {
          description: description.trim(),
          amount: parseFloat(amount),
          paidBy,
          splitAmong,
          expenseDate
        });
        if (onCancelEdit) onCancelEdit();
      } else {
        await onAddExpense({
          description: description.trim(),
          amount: parseFloat(amount),
          paidBy,
          splitAmong,
          expenseDate
        });
      }
      
      // Reset form
      setDescription('');
      setAmount('');
      setPaidBy('');
      setSplitAmong([]);
      setExpenseDate(new Date().toISOString().split('T')[0]);
    } catch (error) {
      console.error('Error saving expense:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-expense-form">
      <div className="form-group">
        <label>Description</label>
        <input
          type="text"
          placeholder="e.g., Dinner at restaurant"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isSubmitting}
        />
      </div>

      <div className="form-group">
        <label>Amount</label>
        <input
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={isSubmitting}
        />
      </div>

      <div className="form-group">
        <label>Date</label>
        <input
          type="date"
          value={expenseDate}
          onChange={(e) => setExpenseDate(e.target.value)}
          disabled={isSubmitting}
        />
      </div>

      <div className="form-group">
        <label>Paid By</label>
        <select
          value={paidBy}
          onChange={(e) => setPaidBy(e.target.value)}
          disabled={isSubmitting}
        >
          <option value="">Select person</option>
          {people.map(person => (
            <option key={person._id} value={person.name}>
              {person.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <div className="split-header">
          <label>Split Among</label>
          <div className="split-buttons">
            {people.length >= 3 && (
              <button 
                type="button" 
                onClick={handleSelectFirstThree}
                className="select-first-three-btn"
                disabled={isSubmitting}
              >
                Select First 3
              </button>
            )}
            <button 
              type="button" 
              onClick={handleSelectAll}
              className="select-all-btn"
              disabled={isSubmitting}
            >
              {splitAmong.length === people.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>
        </div>
        <div className="split-checkboxes">
          {people.map(person => (
            <label key={person._id} className="checkbox-label">
              <input
                type="checkbox"
                checked={splitAmong.includes(person.name)}
                onChange={() => handleSplitToggle(person.name)}
                disabled={isSubmitting}
              />
              <span>{person.name}</span>
            </label>
          ))}
        </div>
        {splitAmong.length > 0 && (
          <p className="split-info">
            Amount per person: ${(parseFloat(amount) / splitAmong.length || 0).toFixed(2)}
          </p>
        )}
      </div>

      <div className="form-actions">
        {editingExpense && onCancelEdit && (
          <button 
            type="button" 
            onClick={onCancelEdit}
            className="cancel-btn"
            disabled={isSubmitting}
          >
            Cancel
          </button>
        )}
        <button 
          type="submit" 
          className="submit-expense-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? (editingExpense ? 'Updating...' : 'Adding...') : (editingExpense ? 'Update Expense' : 'Add Expense')}
        </button>
      </div>
    </form>
  );
}

export default AddExpenseForm;

