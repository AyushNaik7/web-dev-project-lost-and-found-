// src/views/items/ItemDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import itemController from '../../controllers/ItemController';
import authController from '../../controllers/AuthController';
import KnowItemLocationForm from '../components/KnowItemLocationForm';
import '../../assets/css/items.css';

const ItemDetail = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showLocationForm, setShowLocationForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const currentUser = authController.getCurrentUser();
    setUser(currentUser);

    // Load item details
    const fetchItem = async () => {
      try {
        const loadedItem = await itemController.getItemById(id);

        if (!loadedItem) {
          navigate('/not-found');
          return;
        }

        setItem(loadedItem);
      } catch (error) {
        console.error('Error fetching item details:', error);
        navigate('/not-found');
      } finally {
        setIsLoading(false);
      }
    };

    fetchItem();
  }, [id, navigate]);

  const handleStatusChange = async (newStatus) => {
    try {
      const result = await itemController.changeItemStatus(item._id, newStatus);

      if (result.success) {
        // Redirect to thank you page with updated item data
        navigate('/thank-you', {
          state: { item: result.item }
        });
      } else {
        alert('Failed to update status: ' + (result.errors?.status || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error changing item status:', error);
      alert('Failed to update status: ' + (error.message || 'Unknown error'));
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const result = await itemController.deleteItem(item._id);

        if (result.success) {
          navigate('/my-items');
        } else {
          alert('Failed to delete item: ' + (result.errors?.item || 'Unknown error'));
        }
      } catch (error) {
        console.error('Error deleting item:', error);
        alert('Failed to delete item: ' + (error.message || 'Unknown error'));
      }
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'lost':
        return 'status-lost';
      case 'found':
        return 'status-found';
      case 'claimed':
        return 'status-claimed';
      case 'returned':
        return 'status-returned';
      default:
        return '';
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const isOwner = user && item && user._id === item.reportedBy;
  const isAdmin = user && user.role === 'admin';
  const canEdit = isOwner || isAdmin;
  const isLostItem = item && item.status === 'lost';

  const handleKnowLocationClick = () => {
    setShowLocationForm(true);
    setSuccessMessage('');
  };

  const handleLocationFormSubmit = async (formData) => {
    try {
      const result = await itemController.addLocationNotification(item._id, formData);

      if (result.success) {
        // Create a custom item object for the thank you page
        const notificationItem = {
          ...item,
          status: 'notification',
          title: item.title,
          notificationInfo: formData
        };

        // Redirect to thank you page
        navigate('/thank-you', {
          state: { item: notificationItem }
        });
      } else {
        alert('Failed to submit information: ' + (result.errors?.item || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error submitting location notification:', error);
      alert('Failed to submit information: ' + (error.message || 'Unknown error'));
    }
  };

  const handleCancelLocationForm = () => {
    setShowLocationForm(false);
  };

  // Enhanced formatDate function with time
  const formatDateWithTime = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (isLoading) {
    return <div className="container">Loading...</div>;
  }

  // Default image if none provided
  const imageUrl = item.imageUrl || 'https://via.placeholder.com/800x400?text=No+Image';

  return (
    <div className="container item-detail-container">
      <div className="item-detail">
        <img src={imageUrl} alt={item.title} className="item-detail-image" />

        <div className="item-detail-content">
          {successMessage && (
            <div className="alert alert-success">{successMessage}</div>
          )}

          <h2 className="item-detail-title">{item.title}</h2>

          <div className="item-detail-meta">
            <span className="item-category">{item.category}</span>
            <span className={`item-status ${getStatusClass(item.status)}`}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </span>
            <span className="item-date">
              <strong>Date:</strong> {formatDate(item.date)}
            </span>
            <span className="item-location">
              <strong>Location:</strong> {item.location}
            </span>
          </div>

          <div className="item-detail-description">
            <h3>Description</h3>
            <p>{item.description}</p>
          </div>

          <div className="item-detail-contact">
            <h3>Contact Information</h3>
            <p>{item.contactInfo}</p>
          </div>

          {/* Actions for item owner or admin */}
          {canEdit && (
            <div className="item-detail-actions">
              <Link to={`/edit-item/${item.id}`} className="btn btn-primary">
                Edit
              </Link>
              <button onClick={handleDelete} className="btn btn-danger">
                Delete
              </button>

              {item.status === 'lost' && (
                <button
                  onClick={() => handleStatusChange('found')}
                  className="btn btn-secondary"
                >
                  Mark as Found
                </button>
              )}

              {item.status === 'found' && (
                <button
                  onClick={() => handleStatusChange('claimed')}
                  className="btn btn-warning"
                >
                  Mark as Claimed
                </button>
              )}

              {item.status === 'claimed' && (
                <button
                  onClick={() => handleStatusChange('returned')}
                  className="btn btn-primary"
                >
                  Mark as Returned
                </button>
              )}
            </div>
          )}

          {/* Know where it is button for lost items */}
          {user && isLostItem && !isOwner && !showLocationForm && (
            <div className="item-detail-actions" style={{ marginTop: '20px' }}>
              <button onClick={handleKnowLocationClick} className="btn btn-secondary">
                I Know Where This Item Is
              </button>
            </div>
          )}

          {/* Form to submit location information */}
          {showLocationForm && (
            <KnowItemLocationForm
              itemId={item.id}
              onSubmit={handleLocationFormSubmit}
              onCancel={handleCancelLocationForm}
            />
          )}

          {/* Display location notifications for the owner */}
          {isOwner && item.locationNotifications && item.locationNotifications.length > 0 && (
            <div className="item-notifications">
              <h3>People Who Know Where Your Item Is</h3>
              {item.locationNotifications.map(notification => (
                <div key={notification.id} className="notification-item">
                  <div className="notification-header">
                    <span className="notification-name">{notification.name}</span>
                    <span className="notification-date">{formatDateWithTime(notification.submittedAt)}</span>
                  </div>
                  <div className="notification-content">
                    <p><strong>Location:</strong> {notification.locationDetails}</p>
                    {notification.additionalInfo && (
                      <p><strong>Additional Info:</strong> {notification.additionalInfo}</p>
                    )}
                  </div>
                  <div className="notification-contact">
                    <p><strong>Contact:</strong> {notification.contactInfo}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;
