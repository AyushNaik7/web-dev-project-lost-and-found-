// src/views/Home.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ItemCard from './components/ItemCard';
import itemController from '../controllers/ItemController';
import authController from '../controllers/AuthController';
import '../assets/css/main.css';
import '../assets/css/home.css';

const Home = () => {
  const [recentLostItems, setRecentLostItems] = useState([]);
  const [recentFoundItems, setRecentFoundItems] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const currentUser = authController.getCurrentUser();
    setUser(currentUser);

    // Fetch recent items
    const fetchRecentItems = async () => {
      try {
        // Get recent lost items
        const lostItems = await itemController.getLostItems();
        setRecentLostItems(Array.isArray(lostItems) ? lostItems.slice(0, 3) : []);

        // Get recent found items
        const foundItems = await itemController.getFoundItems();
        setRecentFoundItems(Array.isArray(foundItems) ? foundItems.slice(0, 3) : []);
      } catch (error) {
        console.error('Error fetching recent items:', error);
        setRecentLostItems([]);
        setRecentFoundItems([]);
      }
    };

    fetchRecentItems();
  }, []);

  return (
    <div className="container">
      <div className="card hero-card" style={{ textAlign: 'center', padding: '60px 20px', marginBottom: '30px', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
        <h1 style={{ marginBottom: '20px', fontSize: '2.5rem', color: '#2d3748' }}>Lost & Found System</h1>
        <p style={{ fontSize: '1.2rem', maxWidth: '800px', margin: '0 auto 30px', lineHeight: '1.8' }}>
          Lost something? Found an item that someone might be looking for?
          Our system helps connect lost items with their rightful owners.
        </p>
        {!user ? (
          <div>
            <Link to="/login" className="btn btn-primary" style={{ marginRight: '10px' }}>
              Login
            </Link>
            <Link to="/register" className="btn btn-secondary">
              Register
            </Link>
          </div>
        ) : (
          <Link to="/report-item" className="btn btn-report">
            📋 Report an Item
          </Link>
        )}
      </div>

      <div className="items-container">
        <div className="items-header">
          <h2 className="items-title">Recent Lost Items</h2>
          <Link to="/lost-items" className="btn btn-primary">
            View All Lost Items
          </Link>
        </div>

        {recentLostItems.length === 0 ? (
          <div className="no-items">
            <h3>No lost items reported yet</h3>
          </div>
        ) : (
          <div className="items-grid">
            {recentLostItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>

      <div className="items-container">
        <div className="items-header">
          <h2 className="items-title">Recent Found Items</h2>
          <Link to="/found-items" className="btn btn-primary">
            View All Found Items
          </Link>
        </div>

        {recentFoundItems.length === 0 ? (
          <div className="no-items">
            <h3>No found items reported yet</h3>
          </div>
        ) : (
          <div className="items-grid">
            {recentFoundItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>

      <div className="how-it-works">
        <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>How It Works</h2>
        <div className="grid grid-3">
          <div className="how-it-works-item">
            <div className="how-it-works-icon">📝</div>
            <h3 className="how-it-works-title">Report</h3>
            <p className="how-it-works-description">Report lost or found items with details and optional images</p>
          </div>
          <div className="how-it-works-item">
            <div className="how-it-works-icon">🔍</div>
            <h3 className="how-it-works-title">Search</h3>
            <p className="how-it-works-description">Search through listings to find your lost item or the owner of an item you found</p>
          </div>
          <div className="how-it-works-item">
            <div className="how-it-works-icon">🤝</div>
            <h3 className="how-it-works-title">Connect</h3>
            <p className="how-it-works-description">Connect with the person who found your item or who lost the item you found</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
