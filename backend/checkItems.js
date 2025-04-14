const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Item = require('./models/Item');
const User = require('./models/User'); // Add User model to fix populate

// Load env vars
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');

    try {
      // Count items
      const count = await Item.countDocuments();
      console.log(`Total items in database: ${count}`);

      // Get all items
      const items = await Item.find().populate('reportedBy', 'name email');

      if (items.length === 0) {
        console.log('No items found in the database.');
      } else {
        console.log('\nItems in database:');
        items.forEach((item, index) => {
          console.log(`\n--- Item ${index + 1} ---`);
          console.log(`Title: ${item.title}`);
          console.log(`Description: ${item.description}`);
          console.log(`Category: ${item.category}`);
          console.log(`Status: ${item.status}`);
          console.log(`Reported By: ${item.reportedBy ? item.reportedBy.name : 'Unknown'}`);
          console.log(`Created At: ${item.createdAt}`);
        });
      }
    } catch (err) {
      console.error('Error fetching items:', err);
    } finally {
      mongoose.connection.close();
      console.log('\nDatabase connection closed.');
    }
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });
