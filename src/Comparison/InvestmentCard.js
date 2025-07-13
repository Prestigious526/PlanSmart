import React from 'react';
import './InvestmentCard.css';

const InvestmentCard = ({ title, logo, description, color, onClick }) => (
  <div 
    className="investment-card" 
    style={{ borderTop: `5px solid ${color}` }} 
    onClick={onClick}
  >
    <img src={logo} alt={title} className="investment-logo" />
    <h3><strong>{title}</strong></h3>
    <p>{description}</p>
  </div>
);

export default InvestmentCard;