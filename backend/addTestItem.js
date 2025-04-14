const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Item = require('./models/Item');
const User = require('./models/User');

// Load env vars
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    try {
      // Find a user to associate with the item
      const user = await User.findOne();
      
      if (!user) {
        console.error('No users found in the database. Please create a user first.');
        mongoose.connection.close();
        return;
      }
      
      console.log(`Found user: ${user.name} (${user._id})`);
      
      // Create a test item
      const testItem = {
        title: 'Test Item',
        description: 'This is a test item created via script',
        category: 'Electronics',
        location: 'Library',
        date: new Date(),
        status: 'lost',
        contactInfo: 'test@example.com',
        reportedBy: user._id
      };
      
      console.log('Creating test item with data:', testItem);
      
      // Save the item to the database
      const item = await Item.create(testItem);
      
      console.log('Test item created successfully:');
      console.log(`ID: ${item._id}`);
      console.log(`Title: ${item.title}`);
      console.log(`Status: ${item.status}`);
      console.log(`Reported By: ${item.reportedBy}`);
    } catch (err) {
      console.error('Error creating test item:', err);
    } finally {
      mongoose.connection.close();
      console.log('\nDatabase connection closed.');
    }
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });
