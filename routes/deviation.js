// routes/deviation.js

const express = require('express');
const router = express.Router();
const cryptoStats = require('../models/CryptoStats');

// GET /deviation?coin=bitcoin
router.get('/deviation', async (req, res) => {
  const { coin } = req.query;

  try {
    // Fetch the standard deviation from the cryptoStats collection
    const stats = await cryptoStats.findOne({ coin });

    if (!stats) {
      return res.status(404).json({ message: 'No stats found for the specified coin' });
    }

    const { stdDeviation } = stats;

    return res.json({ deviation: stdDeviation });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
