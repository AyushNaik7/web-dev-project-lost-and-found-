const mongoose = require('mongoose');

const LocationNotificationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  contactInfo: {
    type: String,
    required: true
  },
  locationDetails: {
    type: String,
    required: true
  },
  additionalInfo: {
    type: String
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

const ItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  category: {
    type: String,
    required: [true, 'Please add a category']
  },
  location: {
    type: String,
    required: [true, 'Please add a location']
  },
  date: {
    type: Date,
    required: [true, 'Please add a date']
  },
  status: {
    type: String,
    enum: ['lost', 'found', 'claimed', 'returned'],
    required: [true, 'Please add a status']
  },
  imageUrl: {
    type: String
  },
  reportedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  contactInfo: {
    type: String,
    required: [true, 'Please add contact information']
  },
  locationNotifications: [LocationNotificationSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field on save
ItemSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Item', ItemSchema);
