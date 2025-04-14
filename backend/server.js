const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
console.log('Connecting to MongoDB with URI:', process.env.MONGODB_URI ? 'URI exists' : 'URI is missing');
connectDB();

// Route files
const auth = require('./routes/auth');
const items = require('./routes/items');
const categories = require('./routes/categories');

const app = express();

// Body parser
app.use(express.json());

// Enable CORS with specific options
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests from localhost on any port
    const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'];
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(null, false);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Mount routers
app.use('/api/auth', auth);
app.use('/api/items', items);
app.use('/api/categories', categories);

// Basic route for testing
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Test route for auth
app.get('/api/test', (req, res) => {
  res.json({ success: true, message: 'API is working correctly' });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Server running in development mode on port ${PORT}`)
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
