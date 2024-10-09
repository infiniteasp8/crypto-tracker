const mongoose = require('mongoose');

// Schema to store individual cryptocurrency price data

const cryptoDataSchema = new mongoose.Schema({
  coin: { type: String, required: true }, 
  price: { type: Number, required: true },
  marketCap: { type: Number, required: true },
  change24h: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CryptoData', cryptoDataSchema);
