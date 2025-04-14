// src/views/auth/Profile.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authController from '../../controllers/AuthController';
import '../../assets/css/auth.css';

const Profile = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const currentUser = authController.getCurrentUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }

    // Set form data
    setFormData({
      name: currentUser.name,
      email: currentUser.email,
      password: '',
      confirmPassword: ''
    });
  }, [navigate]);

  const { name, email, password, confirmPassword } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    setSuccessMessage('');

    // Validate form
    let formErrors = {};
    if (!name) formErrors.name = 'Name is required';

    if (password && password.length < 6) {
      formErrors.password = 'Password must be at least 6 characters';
    }

    if (password && password !== confirmPassword) {
      formErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setIsLoading(false);
      return;
    }

    try {
      // Update user profile
      const updateData = {
        name
      };

      // Only include password if it was provided
      if (password) {
        updateData.password = password;
      }

      const result = await authController.updateProfile(updateData);

      if (result.success) {
        setSuccessMessage('Profile updated successfully');
        // Clear password fields
        setFormData({
          ...formData,
          password: '',
          confirmPassword: ''
        });
      } else {
        setErrors(result.errors);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrors({ form: 'Failed to update profile. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Your Profile</h2>

      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}

      <div className="user-profile-info">
        <div className="user-avatar">
          <span className="avatar-placeholder">
            {name ? name.charAt(0).toUpperCase() : '?'}
          </span>
        </div>
        <div className="user-details">
          <h3>{name}</h3>
          <p>{email}</p>
        </div>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={handleChange}
          />
          {errors.name && <div className="error">{errors.name}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            disabled
          />
          <small>Email cannot be changed</small>
        </div>

        <div className="form-group">
          <label htmlFor="password">New Password (leave blank to keep current)</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={handleChange}
            placeholder="Enter new password"
          />
          {errors.password && <div className="error">{errors.password}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm New Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={confirmPassword}
            onChange={handleChange}
            placeholder="Confirm new password"
          />
          {errors.confirmPassword && <div className="error">{errors.confirmPassword}</div>}
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
};

export default Profile;
