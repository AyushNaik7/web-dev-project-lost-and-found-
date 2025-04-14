// src/models/CategoryModel.js

class CategoryModel {
  constructor(id, name, description) {
    this.id = id;
    this.name = name;
    this.description = description;
  }

  // Static method to validate category data
  static validate(categoryData) {
    const errors = {};
    
    if (!categoryData.name || categoryData.name.trim() === '') {
      errors.name = 'Category name is required';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  // Static method to get predefined categories
  static getDefaultCategories() {
    return [
      { id: 1, name: 'Electronics', description: 'Phones, laptops, tablets, etc.' },
      { id: 2, name: 'Clothing', description: 'Jackets, hats, scarves, etc.' },
      { id: 3, name: 'Books', description: 'Textbooks, notebooks, etc.' },
      { id: 4, name: 'Personal Items', description: 'Wallets, keys, ID cards, etc.' },
      { id: 5, name: 'Accessories', description: 'Jewelry, watches, glasses, etc.' },
      { id: 6, name: 'Others', description: 'Miscellaneous items' }
    ];
  }
}

export default CategoryModel;
