// jobs/cryptoFetchJob.js

const cryptoData = require('../models/CryptoData');
const cryptoStats = require('../models/CryptoStats');
const axios = require('axios');

// Define CoinGecko IDs for the cryptocurrencies
const coins = ['bitcoin', 'ethereum', 'matic-network'];

const fetchCryptoData = async () => {
  try {
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${coins.join()}&vs_currencies=usd&include_market_cap=true&include_24hr_change=true`;
    const response = await axios.get(url);
    
    if (response.data) {
      for (const coin of coins) {
        const { usd: price, usd_market_cap: marketCap, usd_24h_change: change24h } = response.data[coin];

        // Save or update cryptoData collection with the latest market data
        await cryptoData.create({
          coin,
          price,
          marketCap,
          change24h,
          timestamp: new Date(),
        });

        // Calculate updated stats for each coin
        const statsRecord = await cryptoStats.findOne({ coin });

        if (statsRecord) {
          // Update stats in O(1) for efficient deviation calculation
          const { count, sum, sumOfSquares } = statsRecord;
          const newCount = count + 1;
          const newSum = sum + price;
          const newSumOfSquares = sumOfSquares + price * price;
          const newStdDeviation = Math.sqrt(
            (newSumOfSquares - (newSum * newSum) / newCount) / newCount
          );

          await cryptoStats.updateOne(
            { coin },
            {
              count: newCount,
              sum: newSum,
              sumOfSquares: newSumOfSquares,
              stdDeviation: newStdDeviation,
              lastUpdated: new Date(),
            }
          );
        } else {
          // Create a new stats record if none exists
          const stdDeviation = 0; // Initial deviation would be 0 for a single value
          await cryptoStats.create({
            coin,
            count: 1,
            sum: price,
            sumOfSquares: price * price,
            stdDeviation,
            lastUpdated: new Date(),
          });
        }

        console.log(`Data updated for ${coin}: Price=${price}, Market Cap=${marketCap}, 24h Change=${change24h}`);
      }
    }
  } catch (error) {
    console.error('Error fetching data from CoinGecko:', error.message);
  }
};

// Schedule background job to run every 2 hours
const startCryptoFetchJob = () => {
  // Run initial fetch immediately to populate data
  fetchCryptoData();

  // Set up the interval to run every 2 hours
  setInterval(fetchCryptoData, 2 * 60 * 60 * 1000); // 2 hours = 2 * 60 * 60 * 1000 milliseconds
};

module.exports = { startCryptoFetchJob };
