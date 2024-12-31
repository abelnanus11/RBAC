const mongoose = require('mongoose');
require('dotenv').config();  // To load environment variables from .env

// Function to connect to MongoDB
const connectDB = async () => {
  try {
    // MongoDB connection string from environment variable (Mongo URI)
    const conn = await mongoose.connect(process.env.MONGODB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1); // Exit the process if connection fails
  }
};

module.exports = connectDB;
