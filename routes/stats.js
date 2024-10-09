const express = require('express');
const CryptoData = require('../models/CryptoData');
const router = express.Router();

// GET /stats endpoint to fetch latest data for a given coin
router.get('/stats', async (req, res) => {
  const { coin } = req.query;
  
  try {
    const latestEntry = await CryptoData.findOne({ coin }).sort({ timestamp: -1 });
    if (!latestEntry) return res.status(404).json({ msg: 'Coin data not found' });
    
    res.json({
      price: latestEntry.price,
      marketCap: latestEntry.marketCap,
      change24h: latestEntry.change24h
    });
  } catch (error) {
    res.status(500).json({ msg: 'Server Error' });
  }
});

module.exports = router;
