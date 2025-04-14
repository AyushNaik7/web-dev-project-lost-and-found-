// src/views/components/Footer.jsx
import { Link } from 'react-router-dom';
import '../../assets/css/footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-section">
          <h3 className="footer-title">Lost & Found System</h3>
          <p className="footer-description">
            Helping people reconnect with their lost items and return found items to their rightful owners.
          </p>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">Quick Links</h3>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/lost-items">Lost Items</Link></li>
            <li><Link to="/found-items">Found Items</Link></li>
            <li><Link to="/report-item">Report Item</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">Contact</h3>
          <ul className="footer-contact">
            <li><i className="footer-icon">📍</i> Campus Main Building</li>
            <li><i className="footer-icon">📧</i> support@lostandfound.com</li>
            <li><i className="footer-icon">📞</i> (123) 456-7890</li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="container">
          <p>&copy; {currentYear} Lost & Found System. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
