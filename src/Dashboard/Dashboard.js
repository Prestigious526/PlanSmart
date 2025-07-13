import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  getDoc,
  onSnapshot,
  addDoc,
  serverTimestamp
} from 'firebase/firestore';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import './Dashboard.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  
  // Financial data state
  const [financialData, setFinancialData] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    totalSavings: 0,
    savingsGoal: 0,
    goalProgress: 0,
    recentTransactions: [],
    investmentPortfolio: [],
    portfolioValue: 0,
    portfolioGrowth: 0
  });

  // Form states
  const [newInvestment, setNewInvestment] = useState({
    name: '',
    type: 'Stock',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    returnRate: ''
  });
  const [showInvestmentForm, setShowInvestmentForm] = useState(false);

  // Load user data from Firebase
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          // Set up real-time listeners
          const unsubscribeTransactions = setupTransactionListener(currentUser.uid);
          const unsubscribeInvestments = setupInvestmentListener(currentUser.uid);
          
          // Load user settings
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setFinancialData(prev => ({
              ...prev,
              savingsGoal: userData.savingsGoal || 0
            }));
          }

          setLoading(false);
          
          return () => {
            unsubscribeTransactions();
            unsubscribeInvestments();
          };
        } catch (err) {
          console.error("Error loading data:", err);
          setError('Failed to load financial data');
          setLoading(false);
        }
      } else {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // Set up transaction listener
  const setupTransactionListener = (userId) => {
    const transactionsRef = collection(db, 'users', userId, 'transactions');
    const transactionsQuery = query(transactionsRef);
    
    return onSnapshot(transactionsQuery, (snapshot) => {
      let totalIncome = 0;
      let totalExpenses = 0;
      const recentTransactions = [];
      
      snapshot.forEach(doc => {
        const transaction = doc.data();
        if (transaction.type === "Income") {
          totalIncome += transaction.amount;
        } else if (transaction.type === "Expense") {
          totalExpenses += transaction.amount;
        }
        
        // Get last 5 transactions
        if (recentTransactions.length < 5) {
          recentTransactions.push({
            ...transaction,
            id: doc.id
          });
        }
      });
      
      const totalSavings = totalIncome - totalExpenses;
      const savingsGoal = financialData.savingsGoal;
      const goalProgress = savingsGoal > 0 ? (totalSavings / savingsGoal) * 100 : 0;
      
      setFinancialData(prev => ({
        ...prev,
        totalIncome,
        totalExpenses,
        totalSavings,
        goalProgress,
        recentTransactions: recentTransactions.sort((a, b) => 
          (b.date?.toDate?.() || new Date(b.date)) - (a.date?.toDate?.() || new Date(a.date))
        )
      }));
    });
  };

  // Set up investment listener
  const setupInvestmentListener = (userId) => {
    const investmentsRef = collection(db, 'users', userId, 'investments');
    const investmentsQuery = query(investmentsRef);
    
    return onSnapshot(investmentsQuery, (snapshot) => {
      const investmentPortfolio = [];
      let portfolioValue = 0;
      let initialValue = 0;
      
      snapshot.forEach(doc => {
        const investment = {
          id: doc.id,
          ...doc.data()
        };
        
        investmentPortfolio.push(investment);
        
        // Calculate current value with return rate
        const currentValue = investment.amount * (1 + (investment.returnRate / 100));
        portfolioValue += currentValue;
        initialValue += investment.amount;
      });
      
      const portfolioGrowth = initialValue > 0 ? 
        ((portfolioValue - initialValue) / initialValue) * 100 : 0;
      
      setFinancialData(prev => ({
        ...prev,
        investmentPortfolio,
        portfolioValue,
        portfolioGrowth
      }));
    });
  };

  // Add new investment
  const addInvestment = async () => {
    if (!user) return;
    
    try {
      const investmentsRef = collection(db, 'users', user.uid, 'investments');
      
      await addDoc(investmentsRef, {
        ...newInvestment,
        amount: parseFloat(newInvestment.amount),
        returnRate: parseFloat(newInvestment.returnRate),
        date: serverTimestamp(),
        createdAt: serverTimestamp()
      });
      
      // Reset form
      setNewInvestment({
        name: '',
        type: 'Stock',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        returnRate: ''
      });
      setShowInvestmentForm(false);
    } catch (error) {
      console.error("Error adding investment:", error);
      setError('Failed to add investment');
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/');
    } catch (err) {
      console.error("Logout error:", err);
      setError('Failed to logout');
    }
  };

  // Chart data for financial overview
  const financialOverviewData = {
    labels: ['Income', 'Expenses', 'Savings'],
    datasets: [{
      label: 'Amount (₹)',
      data: [
        financialData.totalIncome,
        financialData.totalExpenses,
        financialData.totalSavings
      ],
      backgroundColor: [
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 99, 132, 0.7)',
        'rgba(75, 192, 192, 0.7)'
      ],
      borderColor: [
        'rgba(54, 162, 235, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(75, 192, 192, 1)'
      ],
      borderWidth: 1
    }]
  };

  // Chart data for investment portfolio
  const investmentChartData = {
    labels: financialData.investmentPortfolio.map(i => i.name),
    datasets: [{
      label: 'Current Value (₹)',
      data: financialData.investmentPortfolio.map(i => 
        i.amount * (1 + (i.returnRate / 100))
      ),
      backgroundColor: financialData.investmentPortfolio.map((_, i) => 
        `hsl(${(i * 360) / financialData.investmentPortfolio.length}, 70%, 50%)`
      ),
      borderWidth: 1
    }]
  };

  // Chart data for portfolio growth
  const growthChartData = {
    labels: ['Initial', 'Current'],
    datasets: financialData.investmentPortfolio.map(investment => ({
      label: investment.name,
      data: [
        investment.amount,
        investment.amount * (1 + (investment.returnRate / 100))
      ],
      borderColor: `hsl(${(Math.random() * 360)}, 70%, 50%)`,
      tension: 0.1,
      fill: false
    }))
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ₹${context.raw.toFixed(2)}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '₹' + value;
          }
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading your financial dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-left">
          <h1>Financial Dashboard</h1>
          <p className="last-login">
            {user?.email} • Last login: {user?.metadata?.lastSignInTime ? 
              new Date(user.metadata.lastSignInTime).toLocaleString() : 
              'Today'}
          </p>
        </div>
        <button onClick={handleLogout} className="logout-btn">
          Sign Out
        </button>
      </header>

      {error && <div className="dashboard-error">{error}</div>}

      <nav className="dashboard-nav">
        <button 
          className={activeTab === 'overview' ? 'active' : ''}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={activeTab === 'investments' ? 'active' : ''}
          onClick={() => setActiveTab('investments')}
        >
          Investments
        </button>
        <button 
          className={activeTab === 'transactions' ? 'active' : ''}
          onClick={() => setActiveTab('transactions')}
        >
          Transactions
        </button>
      </nav>

      <div className="dashboard-content">
        {activeTab === 'overview' && (
          <>
            <section className="financial-summary">
              <div className="summary-card">
                <h3>Total Income</h3>
                <p className="amount">₹{financialData.totalIncome.toFixed(2)}</p>
                <div className="card-icon">💰</div>
              </div>
              
              <div className="summary-card">
                <h3>Total Expenses</h3>
                <p className="amount">₹{financialData.totalExpenses.toFixed(2)}</p>
                <div className="card-icon">💸</div>
              </div>
              
              <div className="summary-card">
                <h3>Current Savings</h3>
                <p className="amount">₹{financialData.totalSavings.toFixed(2)}</p>
                <div className="card-icon">🏦</div>
              </div>
              
              {financialData.savingsGoal > 0 && (
                <div className="summary-card">
                  <h3>Goal Progress</h3>
                  <div className="progress-container">
                    <div 
                      className="progress-bar"
                      style={{ width: `${Math.min(100, financialData.goalProgress)}%` }}
                    ></div>
                    <span className="progress-text">
                      {Math.min(100, financialData.goalProgress).toFixed(1)}%
                    </span>
                  </div>
                  <p>₹{financialData.totalSavings.toFixed(2)} of ₹{financialData.savingsGoal.toFixed(2)}</p>
                </div>
              )}
            </section>

            <section className="charts-section">
              <div className="chart-container">
                <h3>Income vs Expenses</h3>
                <Bar data={financialOverviewData} options={chartOptions} />
              </div>
              
              {financialData.investmentPortfolio.length > 0 && (
                <div className="chart-container">
                  <h3>Investment Portfolio</h3>
                  <Pie data={investmentChartData} options={chartOptions} />
                </div>
              )}
            </section>
          </>
        )}

        {activeTab === 'investments' && (
          <>
            <section className="investments-header">
              <h2>Investment Portfolio</h2>
              <button 
                className="add-investment-btn"
                onClick={() => setShowInvestmentForm(!showInvestmentForm)}
              >
                {showInvestmentForm ? 'Cancel' : '+ Add Investment'}
              </button>
            </section>

            {showInvestmentForm && (
              <div className="investment-form">
                <h3>Add New Investment</h3>
                <div className="form-group">
                  <label>Investment Name</label>
                  <input
                    type="text"
                    value={newInvestment.name}
                    onChange={(e) => setNewInvestment({...newInvestment, name: e.target.value})}
                    placeholder="e.g., Apple Stocks, Mutual Fund XYZ"
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Type</label>
                    <select
                      value={newInvestment.type}
                      onChange={(e) => setNewInvestment({...newInvestment, type: e.target.value})}
                    >
                      <option value="Stock">Stock</option>
                      <option value="Mutual Fund">Mutual Fund</option>
                      <option value="Bond">Bond</option>
                      <option value="ETF">ETF</option>
                      <option value="Real Estate">Real Estate</option>
                      <option value="Crypto">Cryptocurrency</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Amount Invested (₹)</label>
                    <input
                      type="number"
                      value={newInvestment.amount}
                      onChange={(e) => setNewInvestment({...newInvestment, amount: e.target.value})}
                      placeholder="5000"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Date</label>
                    <input
                      type="date"
                      value={newInvestment.date}
                      onChange={(e) => setNewInvestment({...newInvestment, date: e.target.value})}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Return Rate (%)</label>
                    <input
                      type="number"
                      value={newInvestment.returnRate}
                      onChange={(e) => setNewInvestment({...newInvestment, returnRate: e.target.value})}
                      placeholder="5.0"
                      step="0.1"
                    />
                  </div>
                </div>
                
                <button 
                  className="submit-btn"
                  onClick={addInvestment}
                  disabled={!newInvestment.name || !newInvestment.amount || !newInvestment.returnRate}
                >
                  Add Investment
                </button>
              </div>
            )}

            {financialData.investmentPortfolio.length > 0 ? (
              <>
                <div className="portfolio-summary">
                  <div className="portfolio-metric">
                    <h3>Portfolio Value</h3>
                    <p className="value">₹{financialData.portfolioValue.toFixed(2)}</p>
                  </div>
                  <div className="portfolio-metric">
                    <h3>Total Growth</h3>
                    <p className={`value ${financialData.portfolioGrowth >= 0 ? 'positive' : 'negative'}`}>
                      {financialData.portfolioGrowth >= 0 ? '+' : ''}{financialData.portfolioGrowth.toFixed(2)}%
                    </p>
                  </div>
                </div>

                <div className="chart-container full-width">
                  <h3>Investment Growth</h3>
                  <Line 
                    data={growthChartData} 
                    options={{
                      ...chartOptions,
                      scales: {
                        y: {
                          beginAtZero: false
                        }
                      }
                    }} 
                  />
                </div>

                <div className="investments-grid">
                  {financialData.investmentPortfolio.map((investment, index) => (
                    <div key={investment.id} className="investment-card">
                      <div className="investment-header">
                        <h3>{investment.name}</h3>
                        <span className={`investment-type ${investment.type.toLowerCase()}`}>
                          {investment.type}
                        </span>
                      </div>
                      
                      <div className="investment-details">
                        <div className="investment-metric">
                          <span>Invested:</span>
                          <span>₹{investment.amount.toFixed(2)}</span>
                        </div>
                        <div className="investment-metric">
                          <span>Current Value:</span>
                          <span>
                            ₹{(investment.amount * (1 + (investment.returnRate / 100))).toFixed(2)}
                          </span>
                        </div>
                        <div className="investment-metric">
                          <span>Return:</span>
                          <span className={`return ${investment.returnRate >= 0 ? 'positive' : 'negative'}`}>
                            {investment.returnRate >= 0 ? '+' : ''}{investment.returnRate}%
                          </span>
                        </div>
                        <div className="investment-metric">
                          <span>Date:</span>
                          <span>
                            {investment.date?.toDate ? 
                              investment.date.toDate().toLocaleDateString() : 
                              new Date(investment.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="empty-state">
                <p>No investments yet. Add your first investment to start building your portfolio!</p>
              </div>
            )}
          </>
        )}

        {activeTab === 'transactions' && (
          <>
            <section className="transactions-header">
              <h2>Recent Transactions</h2>
              <button 
                className="view-all-btn"
                onClick={() => navigate('/SavingsTracker')}
              >
                View All in Savings Tracker
              </button>
            </section>

            <div className="transactions-list">
              {financialData.recentTransactions.length > 0 ? (
                financialData.recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="transaction-item">
                    <div className="transaction-info">
                      <span className={`transaction-type ${transaction.type.toLowerCase()}`}>
                        {transaction.type === "Income" ? '+' : '-'}
                      </span>
                      <div>
                        <span className="transaction-description">
                          {transaction.type === "Income" ? 
                            transaction.source : 
                            transaction.category}
                        </span>
                        <span className="transaction-date">
                          {transaction.date?.toDate ? 
                            transaction.date.toDate().toLocaleDateString() : 
                            new Date(transaction.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="transaction-amount">
                      ₹{transaction.amount.toFixed(2)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <p>No recent transactions found</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;