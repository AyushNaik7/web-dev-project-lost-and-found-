const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

// Function to check MongoDB connection
const checkMongoConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000 // Timeout after 5s instead of 30s
    });
    console.log('MongoDB connection successful!');
    console.log(`Connected to: ${process.env.MONGODB_URI}`);
    process.exit(0);
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    console.log('\nPlease make sure MongoDB is installed and running.');
    console.log('You can install MongoDB from: https://www.mongodb.com/try/download/community');
    console.log('Or use MongoDB Atlas: https://www.mongodb.com/cloud/atlas');
    console.log('\nUpdate your MONGODB_URI in the .env file if needed.');
    process.exit(1);
  }
};

// Run the check
checkMongoConnection();
