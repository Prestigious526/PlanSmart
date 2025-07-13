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
  Legend
} from 'chart.js';
import './StockDataFetcher.css';
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

// Sample fallback data
const FALLBACK_DATA = {
  AAPL: [
    { date: '2023-08-01', close: 192.58 },
    { date: '2023-08-02', close: 191.17 },
    { date: '2023-08-03', close: 193.54 },
    { date: '2023-08-04', close: 190.91 },
    { date: '2023-08-07', close: 189.37 }
  ],
  MSFT: [
    { date: '2023-08-01', close: 327.78 },
    { date: '2023-08-02', close: 325.12 },
    { date: '2023-08-03', close: 328.39 },
    { date: '2023-08-04', close: 326.45 },
    { date: '2023-08-07', close: 324.01 }
  ]
};

export default function StockDataFetcher() {
  const [ticker, setTicker] = useState('AAPL');
  const [range, setRange] = useState('1mo');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState('');

  const fetchStockData = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Try to get cached data first
      const cacheKey = `stock-${ticker}-${range}`;
      const cachedData = localStorage.getItem(cacheKey);
      
      if (cachedData) {
        const { data, timestamp } = JSON.parse(cachedData);
        // Use cache if less than 15 minutes old
        if (Date.now() - timestamp < 15 * 60 * 1000) {
          setData(data);
          setLastUpdated(new Date(timestamp).toLocaleTimeString());
          setLoading(false);
          return;
        }
      }

      // Try direct Yahoo API
      let response;
      try {
        response = await fetch(
          `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?range=${range}&interval=1d`
        );
      } catch (directError) {
        // If direct access fails, try CORS proxy
        response = await fetch(
          `https://cors-anywhere.herokuapp.com/https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?range=${range}&interval=1d`
        );
      }

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.chart?.result?.[0]) {
        throw new Error('No data available for this ticker');
      }

      const quotes = result.chart.result[0];
      const timestamps = quotes.timestamp;
      const closes = quotes.indicators.quote[0].close;

      // Filter out null values
      const formattedData = timestamps
        .map((t, i) => ({
          date: new Date(t * 1000).toLocaleDateString(),
          close: closes[i]
        }))
        .filter(item => item.close !== null);

      // Cache the data
      const cacheData = {
        data: formattedData,
        timestamp: Date.now()
      };
      localStorage.setItem(cacheKey, JSON.stringify(cacheData));

      setData(formattedData);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error('Fetch error:', err);
      setError(`Failed to load live data: ${err.message}. Showing cached data.`);
      
      // Fallback to sample data if no cache
      setData(FALLBACK_DATA[ticker] || FALLBACK_DATA.AAPL);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockData();
  }, [ticker, range]);

  return (
    <div className="stock-fetcher">
      <div className="controls">
        <input
          type="text"
          value={ticker}
          onChange={(e) => setTicker(e.target.value.toUpperCase())}
          placeholder="Enter ticker (e.g., AAPL)"
        />
        
        <select 
          value={range} 
          onChange={(e) => setRange(e.target.value)}
        >
          <option value="1d">1 Day</option>
          <option value="5d">5 Days</option>
          <option value="1mo">1 Month</option>
          <option value="3mo">3 Months</option>
          <option value="1y">1 Year</option>
        </select>
        
        <button 
          onClick={fetchStockData} 
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="chart-container">
        {data.length > 0 ? (
          <Line
            data={{
              labels: data.map(item => item.date),
              datasets: [{
                label: `${ticker} Closing Price`,
                data: data.map(item => item.close),
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.1
              }]
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
                title: {
                  display: true,
                  text: `${ticker} Stock Price (${range})`
                },
              },
              scales: {
                x: {
                  ticks: {
                    maxRotation: 45,
                    minRotation: 45
                  }
                }
              }
            }}
          />
        ) : (
          <p>No data available</p>
        )}
      </div>
      
      {lastUpdated && (
        <p className="update-time">Last updated: {lastUpdated}</p>
      )}
    </div>
  );
}