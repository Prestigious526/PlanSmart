import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Bar, 
  Pie 
} from "react-chartjs-2";
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  ArcElement
} from "chart.js";
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  addDoc, 
  deleteDoc,
  query,
  where,
  getDocs,
  onSnapshot,
  serverTimestamp
} from "firebase/firestore";
import { auth, db } from "../firebase";
import "./SavingsTracker.css";

// Register Chart.js components
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  ArcElement
);

const SavingsTracker = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // State for form inputs
  const [income, setIncome] = useState(0);
  const [incomeSource, setIncomeSource] = useState("");
  const [expense, setExpense] = useState(0);
  const [expenseCategory, setExpenseCategory] = useState("");
  const [note, setNote] = useState("");
  
  // State for budgets
  const [budgets, setBudgets] = useState({
    Housing: 0,
    Food: 0,
    Transportation: 0,
    Utilities: 0,
    Healthcare: 0,
    Entertainment: 0,
    Education: 0,
    Savings: 0,
    Other: 0
  });
  
  // State for transactions and savings goals
  const [transactions, setTransactions] = useState([]);
  const [savingsGoal, setSavingsGoal] = useState(0);
  const [timeframe, setTimeframe] = useState("monthly");
  
  // Load user data from Firebase on component mount
  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        loadUserData(currentUser.uid);
      } else {
        navigate('/');
      }
    });

    return () => unsubscribeAuth();
  }, [navigate]);

  const loadUserData = async (userId) => {
    try {
      // Load user document
      const userDocRef = doc(db, "users", userId);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setBudgets(userData.budgets || budgets);
        setSavingsGoal(userData.savingsGoal || 0);
        setTimeframe(userData.timeframe || "monthly");
      }

      // Load transactions
      const transactionsRef = collection(db, "users", userId, "transactions");
      const q = query(transactionsRef);
      
      // Set up real-time listener for transactions
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const loadedTransactions = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTransactions(loadedTransactions);
      });

      setLoading(false);
      return unsubscribe;
    } catch (error) {
      console.error("Error loading data:", error);
      setLoading(false);
    }
  };

  // Save budgets and savings goal to Firebase
  const saveUserSettings = async () => {
    if (!user) return;
    
    try {
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, {
        budgets,
        savingsGoal,
        timeframe,
        lastUpdated: serverTimestamp()
      }, { merge: true });
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  };

  // Add transaction to Firebase
  const addTransaction = async (type) => {
    if (!user) return;
    
    try {
      const transactionsRef = collection(db, "users", user.uid, "transactions");
      
      if (type === "Income" && income > 0 && incomeSource) {
        await addDoc(transactionsRef, {
          type,
          amount: parseFloat(income),
          source: incomeSource,
          date: serverTimestamp(),
          createdAt: serverTimestamp()
        });
        setIncome(0);
        setIncomeSource("");
      } else if (type === "Expense" && expense > 0 && expenseCategory) {
        await addDoc(transactionsRef, {
          type,
          amount: parseFloat(expense),
          category: expenseCategory,
          note,
          date: serverTimestamp(),
          createdAt: serverTimestamp()
        });
        setExpense(0);
        setExpenseCategory("");
        setNote("");
      }
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  // Delete transaction from Firebase
  const deleteTransaction = async (id) => {
    if (!user) return;
    
    try {
      const transactionRef = doc(db, "users", user.uid, "transactions", id);
      await deleteDoc(transactionRef);
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  // Save settings whenever they change
  useEffect(() => {
    if (user) {
      const timer = setTimeout(() => {
        saveUserSettings();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [budgets, savingsGoal, timeframe]);

  // Calculate totals
  const totalIncome = transactions
    .filter(t => t.type === "Income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === "Expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const savings = totalIncome - totalExpenses;
  const savingsPercentage = totalIncome > 0 ? (savings / totalIncome) * 100 : 0;
  const goalProgress = savingsGoal > 0 ? (savings / savingsGoal) * 100 : 0;

  // Calculate category expenses
  const categoryExpenses = Object.keys(budgets).reduce((acc, category) => {
    acc[category] = transactions
      .filter(t => t.type === "Expense" && t.category === category)
      .reduce((sum, t) => sum + t.amount, 0);
    return acc;
  }, {});

  // Check if a category is over-budget
  const isOverBudget = (category) => {
    return budgets[category] > 0 && categoryExpenses[category] > budgets[category];
  };

  // Chart data for income vs expenses
  const barChartData = {
    labels: ["Income", "Expenses", "Savings"],
    datasets: [
      {
        label: "Amount (₹)",
        data: [totalIncome, totalExpenses, savings],
        backgroundColor: [
          "rgba(54, 162, 235, 0.7)",
          "rgba(255, 99, 132, 0.7)",
          "rgba(75, 192, 192, 0.7)"
        ],
        borderColor: [
          "rgba(54, 162, 235, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(75, 192, 192, 1)"
        ],
        borderWidth: 1
      }
    ]
  };

  // Pie chart data for expense categories
  const pieChartData = {
    labels: Object.keys(categoryExpenses),
    datasets: [
      {
        data: Object.values(categoryExpenses),
        backgroundColor: [
          "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", 
          "#9966FF", "#FF9F40", "#8AC24A", "#607D8B", "#E91E63"
        ],
        hoverBackgroundColor: [
          "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", 
          "#9966FF", "#FF9F40", "#8AC24A", "#607D8B", "#E91E63"
        ]
      }
    ]
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top"
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
            return "₹" + value;
          }
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading your financial data...</p>
      </div>
    );
  }

  return (
    <div className="savings-tracker">
      <header className="app-header">
        <h1>Smart Savings Tracker</h1>
        {/*<p className="subtitle">Take control of your finances</p>*/}
      </header>

      <div className="dashboard-container">
        {/* Summary Cards */}
        <div className="summary-cards">
          <div className="summary-card income-card">
            <h3>Total Income</h3>
            <p className="amount">₹{totalIncome.toFixed(2)}</p>
            <div className="card-icon">💰</div>
          </div>
          
          <div className="summary-card expense-card">
            <h3>Total Expenses</h3>
            <p className="amount">₹{totalExpenses.toFixed(2)}</p>
            <div className="card-icon">💸</div>
          </div>
          
          <div className="summary-card savings-card">
            <h3>Current Savings</h3>
            <p className="amount">₹{savings.toFixed(2)}</p>
            <p className="percentage">{savingsPercentage.toFixed(1)}% of income</p>
            <div className="card-icon">🏦</div>
          </div>
          
          {savingsGoal > 0 && (
            <div className="summary-card goal-card">
              <h3>Goal Progress</h3>
              <div className="progress-container">
                <div 
                  className="progress-bar"
                  style={{ width: `${Math.min(100, goalProgress)}%` }}
                ></div>
                <span className="progress-text">{Math.min(100, goalProgress).toFixed(1)}%</span>
              </div>
              <p>₹{savings.toFixed(2)} of ₹{savingsGoal.toFixed(2)}</p>
            </div>
          )}
        </div>

        {/* Input Sections */}
        <div className="input-sections">
          <div className="input-section income-input">
            <h2>Add Income</h2>
            <div className="input-group">
              <label>Amount (₹)</label>
              <input
                type="number"
                value={income || ""}
                onChange={(e) => setIncome(parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
            <div className="input-group">
              <label>Source</label>
              <input
                type="text"
                value={incomeSource}
                onChange={(e) => setIncomeSource(e.target.value)}
                placeholder="Salary, Bonus, etc."
              />
            </div>
            <button 
              className="add-button income-button"
              onClick={() => addTransaction("Income")}
              disabled={!income || !incomeSource}
            >
              + Add Income
            </button>
          </div>

          <div className="input-section expense-input">
            <h2>Add Expense</h2>
            <div className="input-group">
              <label>Amount (₹)</label>
              <input
                type="number"
                value={expense || ""}
                onChange={(e) => setExpense(parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
            <div className="input-group">
              <label>Category</label>
              <select
                value={expenseCategory}
                onChange={(e) => setExpenseCategory(e.target.value)}
              >
                <option value="">Select a category</option>
                {Object.keys(budgets).map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div className="input-group">
              <label>Note (Optional)</label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="What was this for?"
              />
            </div>
            <button 
              className="add-button expense-button"
              onClick={() => addTransaction("Expense")}
              disabled={!expense || !expenseCategory}
            >
              + Add Expense
            </button>
          </div>
        </div>

        {/* Budget Management */}
        <div className="budget-section">
          <div className="section-header">
            <h2>Budget Management</h2>
            <div className="timeframe-selector">
              <label>Timeframe:</label>
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          </div>
          
          <div className="budget-grid">
            {Object.keys(budgets).map(category => (
              <div 
                key={category} 
                className={`budget-item ${isOverBudget(category) ? "over-budget" : ""}`}
              >
                <label>{category}</label>
                <div className="budget-input-container">
                  <span>₹</span>
                  <input
                    type="number"
                    value={budgets[category] || ""}
                    onChange={(e) => 
                      setBudgets({
                        ...budgets,
                        [category]: parseFloat(e.target.value) || 0
                      })
                    }
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="budget-status">
                  <span className="spent">
                    Spent: ₹{categoryExpenses[category].toFixed(2)}
                  </span>
                  {budgets[category] > 0 && (
                    <span className="remaining">
                      Remaining: ₹{(budgets[category] - categoryExpenses[category]).toFixed(2)}
                    </span>
                  )}
                </div>
                {isOverBudget(category) && (
                  <div className="warning">Over Budget!</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Savings Goal */}
        <div className="savings-goal">
          <h2>Savings Goal</h2>
          <div className="goal-input">
            <label>Target Amount (₹)</label>
            <input
              type="number"
              value={savingsGoal || ""}
              onChange={(e) => setSavingsGoal(parseFloat(e.target.value) || 0)}
              placeholder="Set your savings goal"
              min="0"
              step="0.01"
            />
          </div>
        </div>

        {/* Charts */}
        <div className="chart-section">
          <div className="chart-container bar-chart">
            <h3>Income vs Expenses</h3>
            <Bar data={barChartData} options={chartOptions} />
          </div>
          <div className="chart-container pie-chart">
            <h3>Expense Breakdown</h3>
            <Pie data={pieChartData} options={chartOptions} />
          </div>
        </div>

        {/* Transaction History */}
        <div className="transactions-section">
          <div className="section-header">
            <h2>Transaction History</h2>
            <div className="transaction-count">
              {transactions.length} transactions
            </div>
          </div>
          
          {transactions.length === 0 ? (
            <div className="empty-state">
              <p>No transactions yet. Add your first income or expense!</p>
            </div>
          ) : (
            <div className="transactions-table">
              <div className="table-header">
                <div className="header-cell">Date</div>
                <div className="header-cell">Type</div>
                <div className="header-cell">Amount</div>
                <div className="header-cell">Details</div>
                <div className="header-cell">Actions</div>
              </div>
              
              <div className="table-body">
                {transactions.map(transaction => (
                  <div 
                    key={transaction.id} 
                    className={`table-row ${transaction.type.toLowerCase()}`}
                  >
                    <div className="table-cell">
                      {transaction.date?.toDate ? 
                        transaction.date.toDate().toLocaleDateString() : 
                        new Date(transaction.date).toLocaleDateString()}
                    </div>
                    <div className="table-cell">
                      <span className={`type-badge ${transaction.type.toLowerCase()}`}>
                        {transaction.type}
                      </span>
                    </div>
                    <div className="table-cell amount">
                      ₹{transaction.amount.toFixed(2)}
                    </div>
                    <div className="table-cell details">
                      {transaction.type === "Income" ? (
                        <span>From: {transaction.source}</span>
                      ) : (
                        <>
                          <span>Category: {transaction.category}</span>
                          {transaction.note && <span>Note: {transaction.note}</span>}
                        </>
                      )}
                    </div>
                    <div className="table-cell actions">
                      <button 
                        className="delete-button"
                        onClick={() => deleteTransaction(transaction.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavingsTracker;