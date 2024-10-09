# Cryptocurrency Tracker

## Overview
The Cryptocurrency Tracker is a server-side application built using Node.js and MongoDB that fetches and tracks real-time data for popular cryptocurrencies (Bitcoin, Ethereum, and Matic). This application provides APIs to retrieve the latest cryptocurrency statistics and calculate standard deviation efficiently.

## Features
- **Fetches real-time cryptocurrency data**: Prices, market caps, and 24-hour price changes for Bitcoin, Ethereum, and Matic.
- **APIs for data retrieval**:
  - `/stats`: Fetches the latest data for a specified cryptocurrency.
  - `/deviation`: Computes the standard deviation of the cryptocurrency prices for the last 100 entries in O(1) time.
- **Scheduled data updates**: Background job that fetches and updates cryptocurrency data every 2 hours.

## Database Design
The application uses MongoDB to store data about cryptocurrencies. Two main collections are used to optimize for efficient queries, particularly for standard deviation calculations:

1. **`cryptoData` Collection**:
   - **Schema**:
     ```javascript
     const cryptoDataSchema = new mongoose.Schema({
       coin: { type: String, required: true }, 
       price: { type: Number, required: true },
       marketCap: { type: Number, required: true },
       change24h: { type: Number, required: true },
       timestamp: { type: Date, default: Date.now }
     });
     ```
   - **Purpose**: Stores individual cryptocurrency price data along with their market cap and 24-hour change. Each entry is time-stamped.

2. **`cryptoStats` Collection**:
   - **Schema**:
     ```javascript
     const cryptoStatsSchema = new mongoose.Schema({
       coin: { type: String, unique: true, required: true },   
       count: { type: Number, default: 0 },  
       sum: { type: Number, default: 0 },    
       sumOfSquares: { type: Number, default: 0 },  
       stdDeviation: { type: Number, default: 0 },  
       lastUpdated: { type: Date, default: Date.now }
     });
     ```
   - **Purpose**: Efficiently stores statistical data for each cryptocurrency, enabling O(1) calculation of the standard deviation. This schema tracks:
     - `count`: Number of entries
     - `sum`: Total price sum for the last 100 entries
     - `sumOfSquares`: Total of the squares of the prices, used for standard deviation calculation
     - `stdDeviation`: Cached value of the standard deviation for quick retrieval
     - `lastUpdated`: Timestamp of the last update

## Technologies Used
- **Node.js**: Backend server implementation.
- **Express.js**: Web framework for building APIs.
- **MongoDB**: NoSQL database for storing cryptocurrency data.
- **Mongoose**: ODM library for MongoDB and Node.js.
- **CoinGecko API**: External API used for fetching real-time cryptocurrency data.

<<<<<<< HEAD
## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/crypto-tracker.git
   cd crypto-tracker
=======
>>>>>>> 64f8d86743dfb3d031e0be963e25766e11c1429a
