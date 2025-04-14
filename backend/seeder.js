const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Category = require('./models/Category');
const Item = require('./models/Item');

// Load env vars
dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGODB_URI);

// Sample data
const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'user'
  }
];

const categories = [
  {
    name: 'Electronics',
    description: 'Phones, laptops, tablets, etc.'
  },
  {
    name: 'Clothing',
    description: 'Jackets, hats, scarves, etc.'
  },
  {
    name: 'Books',
    description: 'Textbooks, notebooks, etc.'
  },
  {
    name: 'Personal Items',
    description: 'Wallets, keys, ID cards, etc.'
  },
  {
    name: 'Accessories',
    description: 'Jewelry, watches, glasses, etc.'
  },
  {
    name: 'Others',
    description: 'Miscellaneous items'
  }
];

// Import data into DB
const importData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Category.deleteMany();
    await Item.deleteMany();

    // Create users
    const createdUsers = await User.create(users);
    const adminUser = createdUsers[0]._id;

    // Create categories
    await Category.create(categories);

    // Create sample items
    await Item.create([
      {
        title: 'Lost iPhone 13',
        description: 'Black iPhone 13 with red case lost in the library',
        category: 'Electronics',
        location: 'Main Library, 2nd Floor',
        date: '2023-04-10',
        status: 'lost',
        imageUrl: 'https://example.com/iphone.jpg',
        reportedBy: adminUser,
        contactInfo: 'admin@example.com'
      },
      {
        title: 'Found Student ID Card',
        description: 'Found a student ID card near the cafeteria',
        category: 'Personal Items',
        location: 'Student Center Cafeteria',
        date: '2023-04-11',
        status: 'found',
        imageUrl: 'https://example.com/id-card.jpg',
        reportedBy: adminUser,
        contactInfo: 'admin@example.com'
      }
    ]);

    console.log('Data Imported!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Delete data from DB
const deleteData = async () => {
  try {
    await User.deleteMany();
    await Category.deleteMany();
    await Item.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Check command line args
if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
} else {
  console.log('Please use -i to import data or -d to delete data');
  process.exit();
}
