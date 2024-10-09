const cron = require('node-cron');
const axios = require('axios');
const CryptoData = require('../models/CryptoData');
const CryptoStats = require('../models/cryptoStats');

// CoinGecko API URLs for fetching data
const cryptoIDs = ['bitcoin', 'matic-network', 'ethereum'];
const url = 'https://api.coingecko.com/api/v3/simple/price';

async function fetchCryptoData() {
  try {
    const response = await axios.get(url, {
      params: {
        ids: cryptoIDs.join(','),
        vs_currencies: 'usd',
        include_market_cap: 'true',
        include_24hr_change: 'true'
      }
    });

    const data = response.data;

    for (const coin of cryptoIDs) {
      const price = data[coin].usd;
      const marketCap = data[coin].usd_market_cap;
      const change24h = data[coin].usd_24h_change;

      // Save data in CryptoData collection
      const newEntry = new CryptoData({ coin, price, marketCap, change24h });
      await newEntry.save();

      // Update statistics in CryptoStats collection
      const stat = await CryptoStats.findOne({ coin });
      if (stat) {
        stat.sum += price;
        stat.sumOfSquares += price * price;
        stat.count = Math.min(stat.count + 1, 100); // Limit count to 100
        stat.stdDeviation = Math.sqrt((stat.sumOfSquares / stat.count) - Math.pow((stat.sum / stat.count), 2));
        await stat.save();
      } else {
        const newStat = new CryptoStats({
          coin,
          count: 1,
          sum: price,
          sumOfSquares: price * price,
          stdDeviation: 0
        });
        await newStat.save();
      }
    }

    console.log('Crypto data updated successfully.');
  } catch (error) {
    console.error('Error fetching crypto data:', error.message);
  }
}

// Schedule the job to run every 2 hours
cron.schedule('0 */2 * * *', fetchCryptoData);
