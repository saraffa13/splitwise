import React, { useState, useEffect } from 'react';
import './ExpenseList.css';

function ExpenseList({ expenses, onDeleteExpense, onEditExpense }) {
  const [expandedDates, setExpandedDates] = useState(new Set());

  const formatDateLabel = (date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const dateStr = date.toDateString();
    const todayStr = today.toDateString();
    const yesterdayStr = yesterday.toDateString();
    
    if (dateStr === todayStr) {
      return 'Today';
    } else if (dateStr === yesterdayStr) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
  };

  // Group expenses by date
  const groupedExpenses = expenses.reduce((acc, expense) => {
    const expenseDate = expense.expenseDate 
      ? new Date(expense.expenseDate)
      : new Date(expense.createdAt);
    const dateKey = expenseDate.toISOString().split('T')[0];
    const dateLabel = formatDateLabel(expenseDate);
    
    if (!acc[dateKey]) {
      acc[dateKey] = {
        dateLabel,
        dateKey,
        expenses: []
      };
    }
    acc[dateKey].expenses.push(expense);
    return acc;
  }, {});

  // Sort dates in descending order
  const sortedDates = Object.keys(groupedExpenses).sort((a, b) => new Date(b) - new Date(a));

  // Expand first date by default
  useEffect(() => {
    if (expandedDates.size === 0 && sortedDates.length > 0) {
      setExpandedDates(new Set([sortedDates[0]]));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expenses.length]);

  if (expenses.length === 0) {
    return (
      <div className="empty-state">
        <p>No expenses yet. Add an expense to get started!</p>
      </div>
    );
  }

  const toggleDate = (dateKey) => {
    const newExpanded = new Set(expandedDates);
    if (newExpanded.has(dateKey)) {
      newExpanded.delete(dateKey);
    } else {
      newExpanded.add(dateKey);
    }
    setExpandedDates(newExpanded);
  };

  return (
    <div className="expense-list-accordion">
      {sortedDates.map(dateKey => {
        const group = groupedExpenses[dateKey];
        const isExpanded = expandedDates.has(dateKey);
        
        return (
          <div key={dateKey} className="expense-date-group">
            <div 
              className="expense-date-header"
              onClick={() => toggleDate(dateKey)}
            >
              <div className="date-header-content">
                <span className="date-label">{group.dateLabel}</span>
                <span className="date-expense-count">
                  {group.expenses.length} {group.expenses.length === 1 ? 'expense' : 'expenses'}
                </span>
              </div>
              <span className={`accordion-icon ${isExpanded ? 'expanded' : ''}`}>
                ▼
              </span>
            </div>
            
            {isExpanded && (
              <div className="expense-date-content">
                {group.expenses.map(expense => (
                  <div key={expense._id} className="expense-item">
                    <div className="expense-header">
                      <h4>{expense.description}</h4>
                      <div className="expense-actions">
                        {onEditExpense && (
                          <button 
                            onClick={() => onEditExpense(expense)}
                            className="edit-expense-btn"
                            title="Edit expense"
                          >
                            ✏️
                          </button>
                        )}
                        <button 
                          onClick={() => onDeleteExpense(expense._id)}
                          className="delete-expense-btn"
                          title="Delete expense"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                    <div className="expense-details">
                      <p className="expense-amount">${expense.amount.toFixed(2)}</p>
                      <p className="expense-paid-by">Paid by: <strong>{expense.paidBy}</strong></p>
                      <p className="expense-split">
                        Split among: {expense.splitAmong.join(', ')}
                      </p>
                      <p className="expense-per-person">
                        ${(expense.amount / expense.splitAmong.length).toFixed(2)} per person
                      </p>
                    </div>
                    <p className="expense-time">
                      {new Date(expense.expenseDate || expense.createdAt).toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default ExpenseList;
