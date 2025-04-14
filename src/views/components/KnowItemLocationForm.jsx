// src/views/components/KnowItemLocationForm.jsx
import { useState } from 'react';
import '../../assets/css/items.css';

const KnowItemLocationForm = ({ itemId, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    contactInfo: '',
    locationDetails: '',
    additionalInfo: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    // Validate form
    let formErrors = {};
    if (!formData.name.trim()) formErrors.name = 'Name is required';
    if (!formData.contactInfo.trim()) formErrors.contactInfo = 'Contact information is required';
    if (!formData.locationDetails.trim()) formErrors.locationDetails = 'Location details are required';

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setIsLoading(false);
      return;
    }

    // Submit form
    onSubmit({
      itemId,
      ...formData,
      submittedAt: new Date()
    });
  };

  return (
    <div className="know-location-form">
      <h3 className="know-location-title">I Know Where This Item Is</h3>
      <p className="know-location-description">
        Please provide your contact information and details about the item's location.
        The owner will be notified and can contact you directly.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Your Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
          />
          {errors.name && <div className="error">{errors.name}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="contactInfo">Contact Information</label>
          <input
            type="text"
            id="contactInfo"
            name="contactInfo"
            value={formData.contactInfo}
            onChange={handleChange}
            placeholder="Phone number or email"
          />
          {errors.contactInfo && <div className="error">{errors.contactInfo}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="locationDetails">Location Details</label>
          <textarea
            id="locationDetails"
            name="locationDetails"
            value={formData.locationDetails}
            onChange={handleChange}
            placeholder="Describe where you saw the item"
            rows="3"
          ></textarea>
          {errors.locationDetails && <div className="error">{errors.locationDetails}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="additionalInfo">Additional Information (Optional)</label>
          <textarea
            id="additionalInfo"
            name="additionalInfo"
            value={formData.additionalInfo}
            onChange={handleChange}
            placeholder="Any other details that might help"
            rows="2"
          ></textarea>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            {isLoading ? 'Submitting...' : 'Submit Information'}
          </button>
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default KnowItemLocationForm;
