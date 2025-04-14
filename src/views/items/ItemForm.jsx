// src/views/items/ItemForm.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import itemController from '../../controllers/ItemController';
import categoryController from '../../controllers/CategoryController';
import authController from '../../controllers/AuthController';
import '../../assets/css/items.css';

const ItemForm = ({ isEdit = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    date: '',
    status: 'lost',
    imageUrl: '',
    contactInfo: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    // Check if user is authenticated
    const currentUser = authController.getCurrentUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        // Load categories
        const loadedCategories = await categoryController.getAllCategories();
        setCategories(Array.isArray(loadedCategories) ? loadedCategories : []);

        // If editing, load item data
        if (isEdit && id) {
          const item = await itemController.getItemById(id);

          if (!item) {
            navigate('/not-found');
            return;
          }

          // Check if user is authorized to edit
          if (item.reportedBy !== currentUser._id && currentUser.role !== 'admin') {
            navigate('/');
            return;
          }

          setFormData({
            title: item.title,
            description: item.description,
            category: item.category,
            location: item.location,
            date: item.date ? item.date.substring(0, 10) : '', // Format date for input field
            status: item.status,
            imageUrl: item.imageUrl || '',
            contactInfo: item.contactInfo
          });

          // Set image preview if there's an image URL
          if (item.imageUrl) {
            setImagePreview(item.imageUrl);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        if (isEdit) {
          navigate('/not-found');
        }
      }
    };

    fetchData();
  }, [isEdit, id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (limit to 1MB)
      if (file.size > 1024 * 1024) {
        alert('Image size should be less than 1MB. Please select a smaller image.');
        return;
      }

      setSelectedImage(file);

      // Create a preview URL for the image
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        setImagePreview(result);

        // Compress the image if needed
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // If the image is too large, scale it down
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 600;

          if (width > MAX_WIDTH) {
            height = Math.round(height * (MAX_WIDTH / width));
            width = MAX_WIDTH;
          }

          if (height > MAX_HEIGHT) {
            width = Math.round(width * (MAX_HEIGHT / height));
            height = MAX_HEIGHT;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to JPEG with reduced quality
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);

          // Store the compressed data URL in the formData
          setFormData({
            ...formData,
            imageUrl: compressedDataUrl
          });
        };
        img.src = result;
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setFormData({
      ...formData,
      imageUrl: ''
    });
    // Reset the file input
    const fileInput = document.getElementById('image-upload');
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    // Validate form data
    const validationErrors = {};
    if (!formData.title) validationErrors.title = 'Title is required';
    if (!formData.description) validationErrors.description = 'Description is required';
    if (!formData.category) validationErrors.category = 'Category is required';
    if (!formData.location) validationErrors.location = 'Location is required';
    if (!formData.date) validationErrors.date = 'Date is required';
    if (!formData.status) validationErrors.status = 'Status is required';
    if (!formData.contactInfo) validationErrors.contactInfo = 'Contact information is required';

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsLoading(false);
      return;
    }

    // Ensure date is in the correct format (YYYY-MM-DD)
    const formattedData = {
      ...formData,
      date: new Date(formData.date).toISOString()
    };

    console.log('Submitting item data:', formattedData);

    try {
      let result;

      if (isEdit) {
        result = await itemController.updateItem(id, formattedData);
      } else {
        result = await itemController.createItem(formattedData);
      }

      console.log('Item submission result:', result);

      if (result.success) {
        console.log('Item created successfully:', result.item);

        // Create a simplified item object for the thank you page
        // to avoid potential circular references or large data
        const thankYouItem = {
          _id: result.item._id || 'new-item',
          title: formData.title,
          category: formData.category,
          location: formData.location,
          date: formData.date,
          status: formData.status,
          description: formData.description.substring(0, 100) + (formData.description.length > 100 ? '...' : '')
        };

        // Redirect to thank you page with item data
        navigate('/thank-you', {
          state: { item: thankYouItem }
        });
      } else {
        console.error('Error from API:', result.errors);
        setErrors(result.errors);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ form: 'Failed to save item. Please try again.' });
      setIsLoading(false);
    }
  };

  return (
    <div className="container item-form-container">
      <div className="item-form">
        <h2 className="item-form-title">
          {isEdit ? 'Edit Item' : 'Report a Lost or Found Item'}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter a title"
            />
            {errors.title && <div className="error">{errors.title}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the item"
              rows="4"
            ></textarea>
            {errors.description && <div className="error">{errors.description}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.category && <div className="error">{errors.category}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Where was it lost/found?"
            />
            {errors.location && <div className="error">{errors.location}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
            {errors.date && <div className="error">{errors.date}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="lost">Lost</option>
              <option value="found">Found</option>
              {isEdit && (
                <>
                  <option value="claimed">Claimed</option>
                  <option value="returned">Returned</option>
                </>
              )}
            </select>
            {errors.status && <div className="error">{errors.status}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="image-upload">Item Image</label>
            <div className="image-upload-container">
              {imagePreview ? (
                <div className="image-preview-container">
                  <img src={imagePreview} alt="Preview" className="image-preview" />
                  <button
                    type="button"
                    className="remove-image-btn"
                    onClick={removeImage}
                    aria-label="Remove image"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div className="upload-placeholder">
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="file-input"
                  />
                  <label htmlFor="image-upload" className="upload-label">
                    <span className="upload-icon">📷</span>
                    <span>Click to select an image</span>
                  </label>
                </div>
              )}
            </div>
            {errors.imageUrl && <div className="error">{errors.imageUrl}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="contactInfo">Contact Information</label>
            <input
              type="text"
              id="contactInfo"
              name="contactInfo"
              value={formData.contactInfo}
              onChange={handleChange}
              placeholder="How can people contact you?"
            />
            {errors.contactInfo && <div className="error">{errors.contactInfo}</div>}
          </div>

          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : isEdit ? 'Update Item' : 'Report Item'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ItemForm;
