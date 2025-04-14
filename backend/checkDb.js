const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');

    // List all collections
    mongoose.connection.db.listCollections().toArray((err, collections) => {
      if (err) {
        console.error('Error listing collections:', err);
        return;
      }

      console.log('Collections in database:');
      collections.forEach(collection => {
        console.log(collection.name);
      });

      // Check items collection
      if (collections.some(c => c.name === 'items')) {
        const Item = require('./models/Item');
        Item.find({})
          .then(items => {
            console.log(`\nFound ${items.length} items in the database:`);
            items.forEach(item => {
              console.log(`- ${item.title} (${item.status}) - Reported by: ${item.reportedBy}`);
            });
            mongoose.connection.close();
          })
          .catch(err => {
            console.error('Error fetching items:', err);
            mongoose.connection.close();
          });
      } else {
        console.log('\nNo items collection found');
        mongoose.connection.close();
      }
    });
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });
