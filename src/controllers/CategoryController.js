// src/controllers/CategoryController.js
import { categoriesAPI } from '../services/api';
import authController from './AuthController';

class CategoryController {
  // Get all categories
  async getAllCategories() {
    try {
      return await categoriesAPI.getAllCategories();
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }

  // Get category by ID
  async getCategoryById(id) {
    try {
      return await categoriesAPI.getCategoryById(id);
    } catch (error) {
      console.error(`Error fetching category with ID ${id}:`, error);
      return null;
    }
  }

  // Create a new category (admin only)
  async createCategory(categoryData) {
    try {
      // Check if user is authenticated and is admin
      const currentUser = authController.getCurrentUser();

      if (!currentUser || currentUser.role !== 'admin') {
        return { success: false, errors: { auth: 'Not authorized' } };
      }

      // Call the API to create a new category
      const response = await categoriesAPI.createCategory(categoryData);
      return { success: true, category: response.data };
    } catch (error) {
      return {
        success: false,
        errors: error.error ? error.error : { category: 'Failed to create category' }
      };
    }
  }

  // Update a category (admin only)
  async updateCategory(id, categoryData) {
    try {
      // Check if user is authenticated and is admin
      const currentUser = authController.getCurrentUser();

      if (!currentUser || currentUser.role !== 'admin') {
        return { success: false, errors: { auth: 'Not authorized' } };
      }

      // Call the API to update the category
      const response = await categoriesAPI.updateCategory(id, categoryData);
      return { success: true, category: response.data };
    } catch (error) {
      return {
        success: false,
        errors: error.error ? error.error : { category: 'Failed to update category' }
      };
    }
  }

  // Delete a category (admin only)
  async deleteCategory(id) {
    try {
      // Check if user is authenticated and is admin
      const currentUser = authController.getCurrentUser();

      if (!currentUser || currentUser.role !== 'admin') {
        return { success: false, errors: { auth: 'Not authorized' } };
      }

      // Call the API to delete the category
      await categoriesAPI.deleteCategory(id);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        errors: error.error ? error.error : { category: 'Failed to delete category' }
      };
    }
  }
}

// Create a singleton instance
const categoryController = new CategoryController();
export default categoryController;
