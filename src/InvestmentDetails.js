import React from 'react';
import './InvestmentDetails.css';

const InvestmentDetails = ({ investment, onClose }) => (
  <div className="investment-details-overlay">
    <div 
      className="investment-details-card" 
      style={{ borderTop: `5px solid ${investment.color}` }}
    >
      <button className="close-button" onClick={onClose}>×</button>
      <img src={investment.logo} alt={investment.title} className="details-logo" />
      <h3><strong>{investment.title}</strong></h3>
      <p>{investment.description}</p>
    </div>
  </div>
);

export default InvestmentDetails;