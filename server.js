const express = require('express');
const connectDB = require('./config/database');

const app = express();

// Connect to MongoDB
connectDB();

// Middlewares
app.use(express.json());

// Starting the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
