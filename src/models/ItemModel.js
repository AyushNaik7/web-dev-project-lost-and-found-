// src/models/ItemModel.js

class ItemModel {
  constructor(id, title, description, category, location, date, status, imageUrl, reportedBy, contactInfo) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.category = category;
    this.location = location;
    this.date = date;
    this.status = status; // 'lost', 'found', 'claimed', 'returned'
    this.imageUrl = imageUrl;
    this.reportedBy = reportedBy; // User ID
    this.contactInfo = contactInfo;
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.locationNotifications = []; // People who know where the item is
  }

  // Static method to validate item data
  static validate(itemData) {
    const errors = {};

    if (!itemData.title || itemData.title.trim() === '') {
      errors.title = 'Title is required';
    }

    if (!itemData.description || itemData.description.trim() === '') {
      errors.description = 'Description is required';
    }

    if (!itemData.category || itemData.category.trim() === '') {
      errors.category = 'Category is required';
    }

    if (!itemData.location || itemData.location.trim() === '') {
      errors.location = 'Location is required';
    }

    if (!itemData.date) {
      errors.date = 'Date is required';
    }

    if (!itemData.status || !['lost', 'found', 'claimed', 'returned'].includes(itemData.status)) {
      errors.status = 'Valid status is required (lost, found, claimed, returned)';
    }

    if (!itemData.contactInfo || itemData.contactInfo.trim() === '') {
      errors.contactInfo = 'Contact information is required';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
}

export default ItemModel;
