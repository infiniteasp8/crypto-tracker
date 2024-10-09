const mongoose = require('mongoose');
require('dotenv').config();
const uri = process.env.MONGODBURI;
const connectDB = async () => {
  try {
    await mongoose.connect(uri);
    // console.log('MongoDB Connected');
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
