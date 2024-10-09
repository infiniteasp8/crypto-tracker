const express = require('express');
const CryptoStats = require('../models/cryptoStats');
const router = express.Router();

// GET /deviation endpoint to fetch standard deviation for a given coin
router.get('/deviation', async (req, res) => {
  const { coin } = req.query;

  try {
    const stat = await CryptoStats.findOne({ coin });
    if (!stat) return res.status(404).json({ msg: 'Coin statistics not found' });

    res.json({ deviation: stat.stdDeviation });
  } catch (error) {
    res.status(500).json({ msg: 'Server Error' });
  }
});

module.exports = router;
