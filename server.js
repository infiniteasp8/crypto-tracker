const express = require('express');
const connectDB = require('./config/database');
const { startCryptoFetchJob } = require('./jobs/cryptoFetchJob'); // Import the updated job
require('dotenv').config();
// Import routes
const statsRoute = require('./routes/stats');
const deviationRoute = require('./routes/deviation');

const app = express();
connectDB();

app.use(express.json());

// Use routes
app.use('/', statsRoute);
app.use('/', deviationRoute);
app.get('/', (req, res) => {
    res.send("Welcome to Crypto Tracker");
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Start the background job immediately after server startup
startCryptoFetchJob();
