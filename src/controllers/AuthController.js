// src/controllers/AuthController.js
import { authAPI } from '../services/api';

class AuthController {
  // Register a new user
  async register(userData) {
    try {
      // Call the API to register the user
      const response = await authAPI.register(userData);
      console.log('Register response in controller:', response);

      if (response.success) {
        return { success: true, user: response.data };
      } else {
        return { success: false, errors: { auth: 'Registration failed' } };
      }
    } catch (error) {
      console.error('Register error in controller:', error);
      return {
        success: false,
        errors: error.error ? { auth: error.error } : { auth: 'Registration failed. Please try again.' }
      };
    }
  }

  // Login user
  async login(email, password) {
    try {
      // Call the API to login the user
      const response = await authAPI.login(email, password);
      console.log('Login response in controller:', response);

      if (response.success) {
        return { success: true, user: response.data };
      } else {
        return { success: false, errors: { auth: 'Invalid email or password' } };
      }
    } catch (error) {
      console.error('Login error in controller:', error);
      return {
        success: false,
        errors: error.error ? { auth: error.error } : { auth: 'Invalid email or password' }
      };
    }
  }

  // Logout user
  logout() {
    // Call the API to logout the user
    authAPI.logout();
    return { success: true };
  }

  // Get current user
  getCurrentUser() {
    return authAPI.getCurrentUser();
  }

  // Check if user is authenticated
  isAuthenticated() {
    return this.getCurrentUser() !== null;
  }

  // Check if user is admin
  isAdmin() {
    const currentUser = this.getCurrentUser();
    return currentUser && currentUser.role === 'admin';
  }

  // Update user profile
  async updateProfile(userData) {
    try {
      const currentUser = this.getCurrentUser();

      if (!currentUser) {
        return { success: false, errors: { auth: 'Not authenticated' } };
      }

      // Call the API to update the user profile
      const response = await authAPI.updateProfile(userData);
      return { success: true, user: response.data };
    } catch (error) {
      return {
        success: false,
        errors: error.error ? { user: error.error } : { user: 'Failed to update profile' }
      };
    }
  }
}

// Create a singleton instance
const authController = new AuthController();
export default authController;
