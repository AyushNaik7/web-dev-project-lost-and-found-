// src/models/UserModel.js

class UserModel {
  constructor(id, name, email, password, role = 'user') {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
    this.createdAt = new Date();
  }

  // Static method to validate user data
  static validate(userData) {
    const errors = {};
    
    if (!userData.name || userData.name.trim() === '') {
      errors.name = 'Name is required';
    }
    
    if (!userData.email || userData.email.trim() === '') {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!userData.password || userData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
}

export default UserModel;
