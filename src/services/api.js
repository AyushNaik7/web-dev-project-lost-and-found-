import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Adding auth token to request:', config.url);
    } else {
      console.warn('No auth token found for request:', config.url);
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log(`Response from ${response.config.url}:`, response.status);
    return response;
  },
  (error) => {
    console.error('API Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: async (userData) => {
    try {
      console.log('Registering user:', userData);
      const response = await api.post('/auth/register', userData);
      console.log('Register response:', response.data);

      if (response.data.token) {
        sessionStorage.setItem('token', response.data.token);
        sessionStorage.setItem('currentUser', JSON.stringify(response.data.data));
      }
      return response.data;
    } catch (error) {
      console.error('Register error:', error);
      if (error.response) {
        console.error('Server response:', error.response.data);
        throw error.response.data;
      } else {
        throw { error: 'Network error' };
      }
    }
  },

  login: async (email, password) => {
    try {
      console.log('Logging in user:', { email });
      const response = await api.post('/auth/login', { email, password });
      console.log('Login response:', response.data);

      if (response.data.token) {
        sessionStorage.setItem('token', response.data.token);
        sessionStorage.setItem('currentUser', JSON.stringify(response.data.data));
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      if (error.response) {
        console.error('Server response:', error.response.data);
        throw error.response.data;
      } else {
        throw { error: 'Network error' };
      }
    }
  },

  logout: () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('currentUser');
  },

  getCurrentUser: () => {
    const userJson = sessionStorage.getItem('currentUser');
    return userJson ? JSON.parse(userJson) : null;
  },

  updateProfile: async (userData) => {
    try {
      const response = await api.put('/auth/updatedetails', userData);
      if (response.data.success) {
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        const updatedUser = { ...currentUser, ...response.data.data };
        sessionStorage.setItem('currentUser', JSON.stringify(updatedUser));
      }
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { error: 'Network error' };
    }
  },

  updatePassword: async (passwordData) => {
    try {
      const response = await api.put('/auth/updatepassword', passwordData);
      if (response.data.token) {
        sessionStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { error: 'Network error' };
    }
  }
};

// Items API calls
export const itemsAPI = {
  getAllItems: async () => {
    try {
      const response = await api.get('/items');
      return response.data.data;
    } catch (error) {
      throw error.response ? error.response.data : { error: 'Network error' };
    }
  },

  getItemById: async (id) => {
    try {
      const response = await api.get(`/items/${id}`);
      return response.data.data;
    } catch (error) {
      throw error.response ? error.response.data : { error: 'Network error' };
    }
  },

  getLostItems: async () => {
    try {
      const response = await api.get('/items/status/lost');
      return response.data.data;
    } catch (error) {
      throw error.response ? error.response.data : { error: 'Network error' };
    }
  },

  getFoundItems: async () => {
    try {
      const response = await api.get('/items/status/found');
      return response.data.data;
    } catch (error) {
      throw error.response ? error.response.data : { error: 'Network error' };
    }
  },

  getMyItems: async () => {
    try {
      const response = await api.get('/items/user/me');
      return response.data.data;
    } catch (error) {
      throw error.response ? error.response.data : { error: 'Network error' };
    }
  },

  createItem: async (itemData) => {
    try {
      console.log('API service: Creating item with data:', itemData);
      console.log('Authorization header:', sessionStorage.getItem('token') ? 'Present' : 'Missing');

      const response = await api.post('/items', itemData);
      console.log('API service: Item creation response:', response.data);
      return response.data;
    } catch (error) {
      console.error('API service: Error creating item:', error);
      if (error.response) {
        console.error('API service: Server response:', error.response.data);
        throw error.response.data;
      } else {
        console.error('API service: Network error:', error.message);
        throw { error: 'Network error' };
      }
    }
  },

  updateItem: async (id, itemData) => {
    try {
      const response = await api.put(`/items/${id}`, itemData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { error: 'Network error' };
    }
  },

  deleteItem: async (id) => {
    try {
      const response = await api.delete(`/items/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { error: 'Network error' };
    }
  },

  addLocationNotification: async (itemId, notificationData) => {
    try {
      const response = await api.post(`/items/${itemId}/notifications`, notificationData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { error: 'Network error' };
    }
  },

  searchItems: async (query) => {
    try {
      const response = await api.get(`/items?title[$regex]=${query}&description[$regex]=${query}`);
      return response.data.data;
    } catch (error) {
      throw error.response ? error.response.data : { error: 'Network error' };
    }
  }
};

// Categories API calls
export const categoriesAPI = {
  getAllCategories: async () => {
    try {
      const response = await api.get('/categories');
      return response.data.data;
    } catch (error) {
      throw error.response ? error.response.data : { error: 'Network error' };
    }
  },

  getCategoryById: async (id) => {
    try {
      const response = await api.get(`/categories/${id}`);
      return response.data.data;
    } catch (error) {
      throw error.response ? error.response.data : { error: 'Network error' };
    }
  },

  createCategory: async (categoryData) => {
    try {
      const response = await api.post('/categories', categoryData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { error: 'Network error' };
    }
  },

  updateCategory: async (id, categoryData) => {
    try {
      const response = await api.put(`/categories/${id}`, categoryData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { error: 'Network error' };
    }
  },

  deleteCategory: async (id) => {
    try {
      const response = await api.delete(`/categories/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { error: 'Network error' };
    }
  }
};
