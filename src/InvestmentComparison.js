import React, { useState } from 'react';
import InvestmentCard from './InvestmentCard';
import InvestmentDetails from './InvestmentDetails';
import './InvestmentComparison.css'; // Updated import

const investments = [
  {
    title: 'Gold',
    logo: 'gold-logo.jpg',
    description: 'Invest in gold for long-term stability. Gold is a safe-haven asset that performs well during economic uncertainty.',
    rateOfReturn: '6-8% per year',
    riskFactor: 'Low',
    liquidity: 'High',
    minimumInvestment: '$500',
    color: '#FFD700', // Gold color
  },
  {
    title: 'Bonds',
    logo: 'bond-logo.jpg',
    description: 'Secure and steady returns with bonds. Bonds are low-risk investments that provide regular income.',
    rateOfReturn: '5-7% per year',
    riskFactor: 'Low',
    liquidity: 'Medium',
    minimumInvestment: '$1,000',
    color: '#87CEEB', // Light blue color
  },
  {
    title: 'Mutual Funds',
    logo: 'mf-logo.jpg',
    description: 'Diversify your portfolio with mutual funds. Mutual funds pool money from multiple investors to invest in a diversified portfolio.',
    rateOfReturn: '10-15% per year',
    riskFactor: 'Medium',
    liquidity: 'High',
    minimumInvestment: '$500',
    color: '#32CD32', // Lime green color
  },
  {
    title: 'Stocks',
    logo: 'stocks-logo.jpg',
    description: 'High risk, high reward with stocks. Stocks offer the potential for high returns but come with significant volatility.',
    rateOfReturn: '15-25% per year',
    riskFactor: 'High',
    liquidity: 'High',
    minimumInvestment: '$1,000',
    color: '#FF4500', // Orange-red color
  },
  {
    title: 'SIPs',
    logo: 'sips-logo.jpg',
    description: 'Systematic Investment Plans for disciplined investing. SIPs allow you to invest small amounts regularly in mutual funds.',
    rateOfReturn: '12-18% per year',
    riskFactor: 'Medium',
    liquidity: 'Medium',
    minimumInvestment: '$500/month',
    color: '#9370DB', // Medium purple color
  },
  {
    title: 'Bank FDs',
    logo: 'fd-logo.jpg',
    description: 'Safe and guaranteed returns with fixed deposits. Bank FDs offer fixed interest rates over a specified period.',
    rateOfReturn: '5-7% per year',
    riskFactor: 'Low',
    liquidity: 'Low',
    minimumInvestment: '$1,000',
    color: '#FF69B4', // Hot pink color
  },
  {
    title: 'Real Estate',
    logo: 'real-estate-logo.jpg',
    description: 'Invest in property for long-term appreciation. Real estate provides steady income and capital appreciation over time.',
    rateOfReturn: '8-12% per year',
    riskFactor: 'Medium',
    liquidity: 'Low',
    minimumInvestment: '$10,000',
    color: '#8B4513', // Saddle brown color
  },
  {
    title: 'Cryptocurrency',
    logo: 'crypto-logo.jpg',
    description: 'High volatility with potential for high returns. Cryptocurrencies are digital assets that can offer significant gains but are highly risky.',
    rateOfReturn: '20-50% per year',
    riskFactor: 'Very High',
    liquidity: 'High',
    minimumInvestment: '$1,000',
    color: '#1E90FF', // Dodger blue color
  },
  {
    title: 'PPF',
    logo: 'ppf-logo.jpg',
    description: 'Public Provident Fund for tax-free savings. PPF is a long-term investment option with tax benefits.',
    rateOfReturn: '7.1% per year',
    riskFactor: 'Low',
    liquidity: 'Low',
    minimumInvestment: '$500/year',
    color: '#20B2AA', // Light sea green color
  },
  {
    title: 'NPS',
    logo: 'nps-logo.jpg',
    description: 'National Pension Scheme for retirement planning. NPS offers market-linked returns with tax benefits.',
    rateOfReturn: '9-12% per year',
    riskFactor: 'Medium',
    liquidity: 'Low',
    minimumInvestment: '$1,000/year',
    color: '#FFA500', // Orange color
  },
];

function InvestmentComparison() {
  const [selectedInvestment, setSelectedInvestment] = useState(null);
  const [riskTolerance, setRiskTolerance] = useState('Low');
  const [timePeriod, setTimePeriod] = useState('Short Term');

  const handleCardClick = (investment) => {
    setSelectedInvestment(investment);
  };

  const handleCloseDetails = () => {
    setSelectedInvestment(null);
  };

  const handleRiskChange = (e) => {
    setRiskTolerance(e.target.value);
  };

  const handleTimePeriodChange = (e) => {
    setTimePeriod(e.target.value);
  };

  const getRecommendation = () => {
    let recommendedInvestments = investments.filter(
      (investment) =>
        investment.riskFactor.toLowerCase() === riskTolerance.toLowerCase()
    );

    if (timePeriod === 'Short Term') {
      recommendedInvestments = recommendedInvestments.filter(
        (investment) => investment.liquidity === 'High'
      );
    } else if (timePeriod === 'Long Term') {
      recommendedInvestments = recommendedInvestments.filter(
        (investment) => investment.liquidity !== 'High'
      );
    }

    return recommendedInvestments.map((investment) => investment.title).join(', ');
  };

  return (
    <div className="App">
      <h2>INVESTMENT COMPARISON TOOL</h2>
      <div className="investment-container">
        {investments.map((investment, index) => (
          <InvestmentCard
            key={index}
            {...investment}
            onClick={() => handleCardClick(investment)}
          />
        ))}
      </div>

      <div className="recommendation-section">
        <h2>Find the Best Investment for You</h2>
        <div className="dropdowns">
          <label>
            Risk Tolerance:
            <select value={riskTolerance} onChange={handleRiskChange}>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Very High">Very High</option>
            </select>
          </label>
          <label>
            Time Period:
            <select value={timePeriod} onChange={handleTimePeriodChange}>
              <option value="Short Term">Short Term</option>
              <option value="Long Term">Long Term</option>
            </select>
          </label>
        </div>
        <div className="recommendation-result">
          <p>
            Based on your risk tolerance (<strong>{riskTolerance}</strong>) and time period (
            <strong>{timePeriod}</strong>), you can invest in: <strong>{getRecommendation()}</strong>
          </p>
        </div>
      </div>

      {selectedInvestment && (
        <InvestmentDetails
          investment={selectedInvestment}
          onClose={handleCloseDetails}
        />
      )}
    </div>
  );
}

export default InvestmentComparison;