import React from 'react';
import './BalanceDisplay.css';

function BalanceDisplay({ balances, onPersonClick }) {
  const balanceEntries = Object.entries(balances || {});
  
  if (balanceEntries.length === 0) {
    return (
      <div className="empty-state">
        <p>No balances to display. Add expenses to see balances.</p>
      </div>
    );
  }

  const sortedBalances = balanceEntries.sort((a, b) => b[1] - a[1]);

  return (
    <div className="balance-display">
      {sortedBalances.map(([name, balance]) => (
        <div 
          key={name} 
          className={`balance-item ${balance > 0 ? 'positive' : balance < 0 ? 'negative' : 'zero'} ${onPersonClick ? 'clickable' : ''}`}
          onClick={onPersonClick ? () => onPersonClick(name) : undefined}
          style={onPersonClick ? { cursor: 'pointer' } : {}}
        >
          <span className="balance-name">{name}</span>
          <span className="balance-amount">
            {balance > 0 ? '+' : ''}${balance.toFixed(2)}
          </span>
        </div>
      ))}
      
      <div className="balance-summary">
        <p>
          {balanceEntries.filter(([, b]) => b > 0).length > 0 && (
            <span className="summary-text">
              {balanceEntries.filter(([, b]) => b > 0).map(([name]) => name).join(', ')} 
              {balanceEntries.filter(([, b]) => b > 0).length === 1 ? ' is' : ' are'} owed money
            </span>
          )}
        </p>
        <p>
          {balanceEntries.filter(([, b]) => b < 0).length > 0 && (
            <span className="summary-text">
              {balanceEntries.filter(([, b]) => b < 0).map(([name]) => name).join(', ')} 
              {balanceEntries.filter(([, b]) => b < 0).length === 1 ? ' owes' : ' owe'} money
            </span>
          )}
        </p>
      </div>
    </div>
  );
}

export default BalanceDisplay;

