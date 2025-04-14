// src/models/DataService.js
import UserModel from './UserModel';
import ItemModel from './ItemModel';
import CategoryModel from './CategoryModel';

// Simulating a database with localStorage
class DataService {
  constructor() {
    this.initializeData();
  }

  // Initialize data if not exists
  initializeData() {
    // Initialize users
    if (!localStorage.getItem('users')) {
      const adminUser = new UserModel(
        1, 
        'Admin User', 
        'admin@college.edu', 
        'admin123', 
        'admin'
      );
      
      localStorage.setItem('users', JSON.stringify([adminUser]));
      localStorage.setItem('nextUserId', '2');
    }

    // Initialize categories
    if (!localStorage.getItem('categories')) {
      localStorage.setItem('categories', JSON.stringify(CategoryModel.getDefaultCategories()));
      localStorage.setItem('nextCategoryId', '7');
    }

    // Initialize items
    if (!localStorage.getItem('items')) {
      const sampleItems = [
        new ItemModel(
          1,
          'Lost iPhone 13',
          'Black iPhone 13 with red case lost in the library',
          'Electronics',
          'Main Library, 2nd Floor',
          '2023-04-10',
          'lost',
          'https://example.com/iphone.jpg',
          1,
          'admin@college.edu'
        ),
        new ItemModel(
          2,
          'Found Student ID Card',
          'Found a student ID card near the cafeteria',
          'Personal Items',
          'Student Center Cafeteria',
          '2023-04-11',
          'found',
          'https://example.com/id-card.jpg',
          1,
          'admin@college.edu'
        )
      ];
      
      localStorage.setItem('items', JSON.stringify(sampleItems));
      localStorage.setItem('nextItemId', '3');
    }
  }

  // User methods
  getUsers() {
    return JSON.parse(localStorage.getItem('users') || '[]');
  }

  getUserById(id) {
    const users = this.getUsers();
    return users.find(user => user.id === id);
  }

  getUserByEmail(email) {
    const users = this.getUsers();
    return users.find(user => user.email === email);
  }

  createUser(userData) {
    const users = this.getUsers();
    const nextId = parseInt(localStorage.getItem('nextUserId') || '1');
    
    const newUser = new UserModel(
      nextId,
      userData.name,
      userData.email,
      userData.password,
      userData.role || 'user'
    );
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('nextUserId', (nextId + 1).toString());
    
    return newUser;
  }

  updateUser(id, userData) {
    const users = this.getUsers();
    const index = users.findIndex(user => user.id === id);
    
    if (index !== -1) {
      users[index] = { ...users[index], ...userData, updatedAt: new Date() };
      localStorage.setItem('users', JSON.stringify(users));
      return users[index];
    }
    
    return null;
  }

  deleteUser(id) {
    const users = this.getUsers();
    const filteredUsers = users.filter(user => user.id !== id);
    
    if (filteredUsers.length < users.length) {
      localStorage.setItem('users', JSON.stringify(filteredUsers));
      return true;
    }
    
    return false;
  }

  // Item methods
  getItems() {
    return JSON.parse(localStorage.getItem('items') || '[]');
  }

  getItemById(id) {
    const items = this.getItems();
    return items.find(item => item.id === id);
  }

  getItemsByStatus(status) {
    const items = this.getItems();
    return items.filter(item => item.status === status);
  }

  getItemsByUser(userId) {
    const items = this.getItems();
    return items.filter(item => item.reportedBy === userId);
  }

  createItem(itemData) {
    const items = this.getItems();
    const nextId = parseInt(localStorage.getItem('nextItemId') || '1');
    
    const newItem = new ItemModel(
      nextId,
      itemData.title,
      itemData.description,
      itemData.category,
      itemData.location,
      itemData.date,
      itemData.status,
      itemData.imageUrl || '',
      itemData.reportedBy,
      itemData.contactInfo
    );
    
    items.push(newItem);
    localStorage.setItem('items', JSON.stringify(items));
    localStorage.setItem('nextItemId', (nextId + 1).toString());
    
    return newItem;
  }

  updateItem(id, itemData) {
    const items = this.getItems();
    const index = items.findIndex(item => item.id === id);
    
    if (index !== -1) {
      items[index] = { 
        ...items[index], 
        ...itemData, 
        updatedAt: new Date() 
      };
      
      localStorage.setItem('items', JSON.stringify(items));
      return items[index];
    }
    
    return null;
  }

  deleteItem(id) {
    const items = this.getItems();
    const filteredItems = items.filter(item => item.id !== id);
    
    if (filteredItems.length < items.length) {
      localStorage.setItem('items', JSON.stringify(filteredItems));
      return true;
    }
    
    return false;
  }

  // Category methods
  getCategories() {
    return JSON.parse(localStorage.getItem('categories') || '[]');
  }

  getCategoryById(id) {
    const categories = this.getCategories();
    return categories.find(category => category.id === id);
  }

  createCategory(categoryData) {
    const categories = this.getCategories();
    const nextId = parseInt(localStorage.getItem('nextCategoryId') || '1');
    
    const newCategory = {
      id: nextId,
      name: categoryData.name,
      description: categoryData.description || ''
    };
    
    categories.push(newCategory);
    localStorage.setItem('categories', JSON.stringify(categories));
    localStorage.setItem('nextCategoryId', (nextId + 1).toString());
    
    return newCategory;
  }

  updateCategory(id, categoryData) {
    const categories = this.getCategories();
    const index = categories.findIndex(category => category.id === id);
    
    if (index !== -1) {
      categories[index] = { ...categories[index], ...categoryData };
      localStorage.setItem('categories', JSON.stringify(categories));
      return categories[index];
    }
    
    return null;
  }

  deleteCategory(id) {
    const categories = this.getCategories();
    const filteredCategories = categories.filter(category => category.id !== id);
    
    if (filteredCategories.length < categories.length) {
      localStorage.setItem('categories', JSON.stringify(filteredCategories));
      return true;
    }
    
    return false;
  }
}

// Create a singleton instance
const dataService = new DataService();
export default dataService;
