import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend,
  Filler
} from 'chart.js';
import './InvestmentCalculator.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend,
  Filler
);

const InvestmentCalculator = () => {
  // Form inputs
  const [initialInvestment, setInitialInvestment] = useState(1000);
  const [monthlyContribution, setMonthlyContribution] = useState(100);
  const [investmentPeriod, setInvestmentPeriod] = useState(10);
  const [expectedReturn, setExpectedReturn] = useState(7);
  const [compoundFrequency, setCompoundFrequency] = useState('monthly');
  const [inflationRate, setInflationRate] = useState(2.5);
  const [includeInflation, setIncludeInflation] = useState(false);

  // Results
  const [projectionData, setProjectionData] = useState([]);
  const [inflatedProjectionData, setInflatedProjectionData] = useState([]);
  const [totalContributions, setTotalContributions] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);
  const [finalAmountInTodayDollars, setFinalAmountInTodayDollars] = useState(0);

  // Calculate investment projection
  useEffect(() => {
    calculateProjection();
  }, [initialInvestment, monthlyContribution, investmentPeriod, expectedReturn, compoundFrequency, inflationRate, includeInflation]);

  const calculateProjection = () => {
    const periods = investmentPeriod * 12;
    const periodicRate = expectedReturn / 100 / (compoundFrequency === 'monthly' ? 12 : 1);
    const compoundingPeriods = compoundFrequency === 'monthly' ? 12 : 1;
    
    let balance = initialInvestment;
    let totalContributed = initialInvestment;
    let data = [];
    let inflatedData = [];
    
    for (let i = 0; i <= periods; i++) {
      // Only add monthly contribution after the first month
      if (i > 0) {
        balance += monthlyContribution;
        totalContributed += monthlyContribution;
      }
      
      // Compound interest calculation
      if (i % (12 / compoundingPeriods) === 0 && i > 0) {
        balance *= (1 + periodicRate);
      }
      
      // Calculate inflation-adjusted value
      const inflatedValue = balance / Math.pow(1 + (inflationRate / 100), i / 12);
      
      data.push({
        year: i / 12,
        balance: balance,
        contributions: totalContributed
      });
      
      inflatedData.push({
        year: i / 12,
        balance: inflatedValue,
        contributions: totalContributed / Math.pow(1 + (inflationRate / 100), i / 12)
      });
    }
    
    setProjectionData(data);
    setInflatedProjectionData(inflatedData);
    setTotalContributions(totalContributed);
    setTotalInterest(balance - totalContributed);
    setFinalAmount(balance);
    setFinalAmountInTodayDollars(inflatedData[inflatedData.length - 1].balance);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  // Format percentage
  const formatPercentage = (value) => {
    return `₹{value.toFixed(2)}%`;
  };

  // Chart data
  const chartData = {
    labels: projectionData.map(item => item.year.toFixed(1)),
    datasets: [
      {
        label: 'Projected Value',
        data: projectionData.map(item => item.balance),
        borderColor: '#4361ee',
        backgroundColor: 'rgba(67, 97, 238, 0.1)',
        borderWidth: 2,
        tension: 0.1,
        fill: true,
        pointRadius: 0
      },
      {
        label: 'Total Contributions',
        data: projectionData.map(item => item.contributions),
        borderColor: '#4cc9f0',
        backgroundColor: 'rgba(76, 201, 240, 0.1)',
        borderWidth: 2,
        tension: 0.1,
        fill: false,
        pointRadius: 0,
        borderDash: [5, 5]
      },
      ...(includeInflation ? [{
        label: 'Inflation-Adjusted Value',
        data: inflatedProjectionData.map(item => item.balance),
        borderColor: '#f72585',
        backgroundColor: 'rgba(247, 37, 133, 0.1)',
        borderWidth: 2,
        tension: 0.1,
        fill: false,
        pointRadius: 0
      }] : [])
    ]
  };

  const chartOptions = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += formatCurrency(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Years'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Value (₹)'
        },
        ticks: {
          callback: function(value) {
            return '₹' + value.toLocaleString();
          }
        }
      }
    }
  };

  return (
    <div className="investment-calculator">
      <div className="calculator-header">
        <h1>Investment Calculator</h1>
        <p>Project your potential investment growth with different scenarios</p>
      </div>

      <div className="calculator-container">
        <div className="input-section">
          <div className="input-card">
            <h2>Investment Parameters</h2>
            
            <div className="input-group">
              <label>Initial Investment (₹)</label>
              <div className="input-with-icon">
                <input
                  type="number"
                  value={initialInvestment}
                  onChange={(e) => setInitialInvestment(parseFloat(e.target.value) || 0)}
                  min="0"
                  step="100"
                />
              </div>
            </div>

            <div className="input-group">
              <label>Monthly Contribution (₹)</label>
              <div className="input-with-icon">
                <input
                  type="number"
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(parseFloat(e.target.value) || 0)}
                  min="0"
                  step="10"
                />
              </div>
            </div>

            <div className="input-group">
              <label>Investment Period (years)</label>
              <input
                type="range"
                min="1"
                max="50"
                value={investmentPeriod}
                onChange={(e) => setInvestmentPeriod(parseInt(e.target.value))}
              />
              <div className="range-value">{investmentPeriod} years</div>
            </div>

            <div className="input-group">
              <label>Expected Annual Return (%)</label>
              <input
                type="range"
                min="0"
                max="20"
                step="0.1"
                value={expectedReturn}
                onChange={(e) => setExpectedReturn(parseFloat(e.target.value))}
              />
              <div className="range-value">{expectedReturn}%</div>
            </div>

            <div className="input-group">
              <label>Compounding Frequency</label>
              <select
                value={compoundFrequency}
                onChange={(e) => setCompoundFrequency(e.target.value)}
              >
                <option value="monthly">Monthly</option>
                <option value="annually">Annually</option>
              </select>
            </div>

            <div className="input-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={includeInflation}
                  onChange={(e) => setIncludeInflation(e.target.checked)}
                />
                Include Inflation Adjustment
              </label>
            </div>

            {includeInflation && (
              <div className="input-group">
                <label>Expected Inflation Rate (%)</label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.1"
                  value={inflationRate}
                  onChange={(e) => setInflationRate(parseFloat(e.target.value))}
                />
                <div className="range-value">{inflationRate}%</div>
              </div>
            )}
          </div>
        </div>

        <div className="results-section">
          <div className="results-summary">
            <div className="summary-card">
              <h3>Final Investment Value</h3>
              <p className="amount">{formatCurrency(finalAmount)}</p>
              {includeInflation && (
                <p className="subtext">
                  {formatCurrency(finalAmountInTodayDollars)} in today's dollars
                </p>
              )}
            </div>

            <div className="summary-card">
              <h3>Total Contributions</h3>
              <p className="amount">{formatCurrency(totalContributions)}</p>
            </div>

            <div className="summary-card">
              <h3>Total Interest Earned</h3>
              <p className="amount">{formatCurrency(totalInterest)}</p>
              <p className="subtext">
                {formatPercentage((totalInterest / totalContributions) * 100)} return on contributions
              </p>
            </div>
          </div>

          <div className="chart-container">
            <Line data={chartData} options={chartOptions} />
          </div>

          <div className="detailed-results">
            <h3>Year-by-Year Projection</h3>
            <div className="results-table">
              <div className="table-header">
                <div>Year</div>
                <div>Value</div>
                <div>Contributions</div>
                <div>Interest</div>
                {includeInflation && <div>Today's Value</div>}
              </div>
              <div className="table-body">
                {projectionData
                  .filter((_, index) => index % 12 === 0 || index === projectionData.length - 1)
                  .map((item, index) => (
                    <div key={index} className="table-row">
                      <div>{item.year.toFixed(1)}</div>
                      <div>{formatCurrency(item.balance)}</div>
                      <div>{formatCurrency(item.contributions)}</div>
                      <div>{formatCurrency(item.balance - item.contributions)}</div>
                      {includeInflation && (
                        <div>{formatCurrency(inflatedProjectionData[index * 12].balance)}</div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentCalculator;