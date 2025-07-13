import React, { useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Fallback data generator
const generateMockData = (days = 60) => {
  let price = 150;
  return Array.from({ length: days }, (_, i) => {
    price += (Math.random() - 0.5) * 2;
    return {
      date: new Date(Date.now() - (days - i) * 86400000).toLocaleDateString(),
      close: parseFloat(price.toFixed(2))
    };
  });
};

// Real data fetcher
const fetchStockData = async (ticker = 'AAPL', range = '1mo') => {
  try {
    const response = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?range=${range}&interval=1d`
    );
    
    if (!response.ok) throw new Error('Network response failed');
    
    const data = await response.json();
    const quotes = data.chart.result[0];
    
    return quotes.timestamp.map((t, i) => ({
      date: new Date(t * 1000).toLocaleDateString(),
      close: quotes.indicators.quote[0].close[i]
    })).filter(item => item.close !== null);
    
  } catch (error) {
    console.error('API failed, using mock data:', error);
    return generateMockData();
  }
};

export default function StockPredictor() {
  const [ticker, setTicker] = useState('AAPL');
  const [history, setHistory] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [model, setModel] = useState(null);
  const [status, setStatus] = useState({
    loadingModel: true,
    loadingData: true,
    loadingPrediction: false,
    error: null
  });

  // Load TensorFlow model
  useEffect(() => {
    const loadModel = async () => {
      try {
        setStatus(prev => ({ ...prev, loadingModel: true, error: null }));
        const model = await tf.loadLayersModel('/model/model.json');
        setModel(model);
        setStatus(prev => ({ ...prev, loadingModel: false }));
      } catch (err) {
        console.error("Model load error:", err);
        setStatus(prev => ({
          ...prev,
          loadingModel: false,
          error: "Advanced prediction model unavailable - using trend analysis"
        }));
      }
    };
    
    loadModel();
  }, []);

  // Load stock data
  useEffect(() => {
    const loadData = async () => {
      setStatus(prev => ({ ...prev, loadingData: true, error: null }));
      try {
        const data = await fetchStockData(ticker);
        if (!data || data.length === 0) {
          throw new Error('No data received');
        }
        setHistory(data);
      } catch (err) {
        setStatus(prev => ({
          ...prev,
          error: "Failed to fetch live data - showing sample data"
        }));
        setHistory(generateMockData());
      } finally {
        setStatus(prev => ({ ...prev, loadingData: false }));
      }
    };
    
    if (ticker) loadData();
  }, [ticker]);

  // Improved prediction function
  const predict = async () => {
    if (!history || history.length < 4) {
      setStatus(prev => ({
        ...prev,
        error: "Not enough data to make prediction (need at least 4 data points)"
      }));
      return;
    }
    
    setStatus(prev => ({ ...prev, loadingPrediction: true, error: null }));
    setPrediction(null);
    
    try {
      // Ensure we have valid data
      const validHistory = history.filter(item => 
        item.close !== null && !isNaN(item.close)
      );
      if (validHistory.length < 4) {
        throw new Error('Insufficient valid data points');
      }
      
      const closes = validHistory.map(d => d.close);
      const lastClose = closes[closes.length - 1];
      
      // Normalize data for model prediction if available
      let predictedValue;
      let usingModel = false;
      
      if (model && closes.length >= 60) {
        usingModel = true;
        const min = Math.min(...closes);
        const range = Math.max(...closes) - min;
        const normalized = closes.slice(-60).map(x => (x - min) / range);
        
        // Prepare tensor (60-day lookback)
        const inputTensor = tf.tensor3d(
          [normalized], 
          [1, 60, 1]
        );
        
        // Predict
        const output = model.predict(inputTensor);
        predictedValue = (await output.data())[0] * range + min;
        output.dispose();
        inputTensor.dispose();
      } else {
        // Fallback: Weighted moving average
        const weights = [0.1, 0.2, 0.3, 0.4]; // Recent days weighted heavier
        const last4 = closes.slice(-4);
        predictedValue = last4.reduce((sum, val, i) => sum + (val * weights[i]), 0);
      }
      
      // Calculate next trading day
      const lastDate = new Date(validHistory[validHistory.length-1].date);
      if (isNaN(lastDate.getTime())) {
        throw new Error('Invalid date format');
      }
      
      const nextDate = new Date(lastDate);
      nextDate.setDate(nextDate.getDate() + 1);
      
      // Skip weekends
      if (nextDate.getDay() === 0) nextDate.setDate(nextDate.getDate() + 1);
      if (nextDate.getDay() === 6) nextDate.setDate(nextDate.getDate() + 2);
      
      setPrediction({
        price: parseFloat(predictedValue.toFixed(2)),
        date: nextDate.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }),
        usingModel
      });
      
    } catch (err) {
      console.error("Prediction error:", err);
      setStatus(prev => ({
        ...prev,
        error: `Prediction failed: ${err.message}`
      }));
    } finally {
      setStatus(prev => ({ ...prev, loadingPrediction: false }));
    }
  };

  // Chart data
  const chartData = {
    labels: history.map(d => d.date),
    datasets: [
      {
        label: 'Historical Prices',
        data: history.map(d => d.close),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
        pointRadius: 0
      },
      ...(prediction ? [{
        label: 'Prediction',
        data: [
          ...Array(history.length - 1).fill(null),
          history[history.length-1].close,
          prediction.price
        ],
        borderColor: 'rgb(255, 99, 132)',
        borderDash: [5, 5],
        pointRadius: 4
      }] : [])
    ]
  };

  return (
    <div className="stock-predictor">
      <h2>Stock Price Predictor</h2>
      
      <div className="controls">
        <input
          type="text"
          value={ticker}
          onChange={(e) => setTicker(e.target.value.toUpperCase())}
          placeholder="Enter ticker (e.g., AAPL)"
          disabled={status.loadingData}
        />
        
        <button
          onClick={predict}
          disabled={status.loadingData || status.loadingPrediction || history.length < 4}
        >
          {status.loadingPrediction ? (
            <>
              <span className="spinner"></span> Predicting...
            </>
          ) : (
            'Predict Next Day'
          )}
        </button>
      </div>
      
      {status.loadingModel && (
        <div className="status">Loading prediction model...</div>
      )}
      
      {status.error && (
        <div className="error">{status.error}</div>
      )}
      
      <div className="chart-container">
        {status.loadingData ? (
          <div className="loading-chart">Loading data...</div>
        ) : (
          <Line 
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                title: {
                  display: true,
                  text: `${ticker} Price History`
                },
                tooltip: {
                  callbacks: {
                    label: (ctx) => `$${ctx.raw?.toFixed(2) || 'N/A'}`
                  }
                }
              },
              scales: {
                x: {
                  ticks: {
                    maxRotation: 45,
                    minRotation: 45
                  }
                },
                y: {
                  ticks: {
                    callback: (value) => `$${value}`
                  }
                }
              }
            }}
          />
        )}
      </div>
      
      {prediction && (
        <div className="prediction-result">
          <h3>
            {prediction.usingModel ? 'AI Model Prediction' : 'Trend Analysis'}
          </h3>
          <p>Next trading day ({prediction.date}):</p>
          <p className="predicted-price">${prediction.price}</p>
          <p>Last close: ${history[history.length-1].close.toFixed(2)}</p>
          {!prediction.usingModel && (
            <p className="disclaimer">
              (Using trend analysis - AI model requires 60 days of data)
            </p>
          )}
        </div>
      )}
      
      <style jsx>{`
        .stock-predictor {
          max-width: 900px;
          margin: 0 auto;
          padding: 20px;
          font-family: Arial, sans-serif;
        }
        .controls {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
        }
        input {
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          flex-grow: 1;
        }
        button {
          padding: 8px 16px;
          background: #3182ce;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        button:disabled {
          background: #cccccc;
          cursor: not-allowed;
        }
        .spinner {
          display: inline-block;
          width: 12px;
          height: 12px;
          border: 2px solid rgba(255,255,255,0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s ease-in-out infinite;
          margin-right: 8px;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .status, .loading-chart {
          color: #666;
          padding: 10px;
          text-align: center;
        }
        .error {
          color: #d32f2f;
          background: #fde0e0;
          padding: 10px;
          border-radius: 4px;
          margin-bottom: 15px;
        }
        .chart-container {
          height: 400px;
          margin-bottom: 20px;
        }
        .prediction-result {
          background: #f0f7ff;
          padding: 15px;
          border-radius: 6px;
          margin-top: 20px;
        }
        .predicted-price {
          font-size: 24px;
          font-weight: bold;
          color: #3182ce;
          margin: 5px 0;
        }
        .disclaimer {
          font-size: 12px;
          color: #666;
          margin-top: 5px;
        }
      `}</style>
    </div>
  );
}