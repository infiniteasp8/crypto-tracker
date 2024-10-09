// routes/stats.js

const express = require('express');
const router = express.Router();
const cryptoData = require('../models/CryptoData');

// GET /stats?coin=bitcoin
router.get('/stats', async (req, res) => {
  const { coin } = req.query;

  try {
    // Fetch the latest record from the cryptoData collection
    const latestData = await cryptoData.findOne({ coin }).sort({ timestamp: -1 });

    if (!latestData) {
      return res.status(404).json({ message: 'No data found for the specified coin' });
    }

    const { price, marketCap, change24h } = latestData;

    return res.json({ price, marketCap, '24hChange': change24h });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
