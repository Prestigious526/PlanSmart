export const fetchStockData = async (ticker = 'AAPL', range = '3mo') => {
    try {
      const response = await fetch(
        `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?range=${range}&interval=1d`
      );
      
      if (!response.ok) throw new Error('Network response failed');
      
      const data = await response.json();
      
      // Extract relevant data from Yahoo's complex response
      const quotes = data.chart.result[0];
      const timestamps = quotes.timestamp;
      const closes = quotes.indicators.quote[0].close;
      
      // Combine dates with closing prices
      return timestamps.map((timestamp, i) => ({
        date: new Date(timestamp * 1000).toLocaleDateString(),
        close: closes[i]
      })).filter(item => item.close !== null); // Filter null values
      
    } catch (error) {
      console.error('Failed to fetch stock data:', error);
      throw error;
    }
  };