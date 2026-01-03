import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PersonDetail.css';
import API_URL from '../config';

function PersonDetail({ personName, projectId, onClose }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPersonDetails();
  }, [personName, projectId]);

  const fetchPersonDetails = async () => {
    try {
      const response = await axios.get(`${API_URL}/projects/${projectId}/person/${personName}/balances`);
      setDetails(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching person details:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="person-detail-overlay" onClick={onClose}>
        <div className="person-detail-modal" onClick={(e) => e.stopPropagation()}>
          <div className="loading">Loading...</div>
        </div>
      </div>
    );
  }

  if (!details) {
    return null;
  }

  const owesToEntries = Object.entries(details.owesTo);
  const owedFromEntries = Object.entries(details.owedFrom);
  const totalOwed = Math.abs(details.totalBalance);

  return (
    <div className="person-detail-overlay" onClick={onClose}>
      <div className="person-detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="person-detail-header">
          <h2>{details.personName}'s Balance</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>

        <div className="person-detail-content">
          {details.totalBalance === 0 ? (
            <div className="settled-section">
              <div className="settled-icon">✓</div>
              <h3>All Settled Up!</h3>
              <p>{details.personName} has no outstanding balances.</p>
            </div>
          ) : details.totalBalance > 0 ? (
            <div className="owed-section-simple">
              <div className="total-owed-display">
                <h3>You are owed</h3>
                <div className="total-amount positive">${totalOwed.toFixed(2)}</div>
              </div>
              {owedFromEntries.length > 0 && (
                <div className="owed-from-list">
                  <h4>By:</h4>
                  <div className="balance-list">
                    {owedFromEntries.map(([name, amount]) => (
                      <div key={name} className="balance-item owed">
                        <span className="person-name">{name}</span>
                        <span className="amount">${amount.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="owes-section-simple">
              <div className="total-owed-display">
                <h3>You owe</h3>
                <div className="total-amount negative">${totalOwed.toFixed(2)}</div>
              </div>
              {owesToEntries.length > 0 && (
                <div className="owes-to-list">
                  <h4>To:</h4>
                  <div className="balance-list">
                    {owesToEntries.map(([name, amount]) => (
                      <div key={name} className="balance-item owes">
                        <span className="person-name">{name}</span>
                        <span className="amount">${amount.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PersonDetail;

