// MongoDB Atlas connection manager using Mongoose.

const mongoose = require('mongoose');
const config = require('./index');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongodbUri, {
      dbName: 'lm_compliance',
    });
    console.log(`[database] Connected to MongoDB Atlas (${conn.connection.host}/${conn.connection.name})`);
    return conn;
  } catch (error) {
    console.error(`[database] MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
