// src/views/items/ThankYouPage.jsx
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../../assets/css/items.css';

const ThankYouPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [itemData, setItemData] = useState(null);

  useEffect(() => {
    console.log('ThankYouPage: location state:', location.state);

    // Get item data from location state
    if (location.state && location.state.item) {
      console.log('ThankYouPage: item data found:', location.state.item);
      setItemData(location.state.item);
    } else {
      console.log('ThankYouPage: No item data found in location state');
      // If no data was passed, redirect to home after a delay
      const timer = setTimeout(() => {
        navigate('/');
      }, 5000);

      return () => clearTimeout(timer);
    }

    // Auto-redirect after 15 seconds
    const timer = setTimeout(() => {
      navigate('/');
    }, 15000);

    return () => clearTimeout(timer);
  }, [location, navigate]);

  // Determine message based on item status
  const getMessage = () => {
    if (!itemData) return { title: 'Thank You!', message: 'Your submission has been received.' };

    if (itemData.status === 'lost') {
      return {
        title: 'Item Reported as Lost',
        message: `We've recorded that you lost your ${itemData.title}. We'll notify you if someone finds it.`
      };
    } else if (itemData.status === 'found') {
      return {
        title: 'Thank You for Finding This Item!',
        message: `Your report about finding ${itemData.title} has been recorded. The owner will be notified.`
      };
    } else if (itemData.status === 'notification') {
      return {
        title: 'Thank You for Your Help!',
        message: `Your information about the ${itemData.title} has been submitted to the owner. They may contact you for more details.`
      };
    }

    return {
      title: 'Thank You!',
      message: 'Your submission has been processed successfully.'
    };
  };

  const { title, message } = getMessage();

  return (
    <div className="container">
      <div className="thank-you-container">
        <div className="thank-you-icon">
          {!itemData ? '✅' :
           itemData.status === 'lost' ? '🔍' :
           itemData.status === 'found' ? '✅' :
           itemData.status === 'notification' ? '🔔' : '✅'}
        </div>
        <h1 className="thank-you-title">{title}</h1>
        <p className="thank-you-message">{message}</p>

        {itemData && (
          <div className="thank-you-details">
            <h3>Item Details:</h3>
            <ul>
              <li><strong>Title:</strong> {itemData.title}</li>
              <li><strong>Category:</strong> {itemData.category}</li>
              <li><strong>Location:</strong> {itemData.location}</li>
              <li><strong>Date:</strong> {itemData.date ? new Date(itemData.date).toLocaleDateString() : 'Not specified'}</li>
              {itemData.status !== 'notification' && (
                <li><strong>Status:</strong> {itemData.status.charAt(0).toUpperCase() + itemData.status.slice(1)}</li>
              )}
              {itemData.status === 'notification' && itemData.notificationInfo && (
                <>
                  <li><strong>Your Name:</strong> {itemData.notificationInfo.name}</li>
                  <li><strong>Your Contact:</strong> {itemData.notificationInfo.contactInfo}</li>
                </>
              )}
            </ul>
          </div>
        )}

        <div className="thank-you-actions">
          <Link to="/" className="btn btn-primary">Go to Home</Link>
          <Link to="/my-items" className="btn btn-secondary">View My Items</Link>
        </div>

        <p className="thank-you-redirect">You will be redirected to the home page in a few seconds...</p>
      </div>
    </div>
  );
};

export default ThankYouPage;
