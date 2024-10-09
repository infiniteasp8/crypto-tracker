const mongoose = require('mongoose');

// Schema to store the deviation elements to find it in O(1)
const cryptoStatsSchema = new mongoose.Schema({
  coin: { type: String, unique: true, required: true },   
  count: { type: Number, default: 0 },  
  sum: { type: Number, default: 0 },    
  sumOfSquares: { type: Number, default: 0 },  
  stdDeviation: { type: Number, default: 0 },  
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CryptoStats', cryptoStatsSchema);
