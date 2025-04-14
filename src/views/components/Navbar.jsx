// src/views/components/Navbar.jsx
import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import authController from '../../controllers/AuthController';
import '../../assets/css/navbar.css';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const currentUser = authController.getCurrentUser();
    setUser(currentUser);

    // Add event listener for storage changes (for login/logout across tabs)
    const handleStorageChange = () => {
      const updatedUser = authController.getCurrentUser();
      setUser(updatedUser);
    };

    window.addEventListener('storage', handleStorageChange);

    // Check for user data every 5 seconds (in case it changes)
    const interval = setInterval(() => {
      const updatedUser = authController.getCurrentUser();
      if (JSON.stringify(updatedUser) !== JSON.stringify(user)) {
        setUser(updatedUser);
      }
    }, 5000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [user]);

  const handleLogout = () => {
    authController.logout();
    setUser(null);
    navigate('/login');
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo">
          Lost & Found System
        </Link>

        <button className="navbar-toggle" onClick={toggleMenu}>
          ☰
        </button>

        <ul className={`navbar-menu ${menuOpen ? 'active' : ''}`}>
          <li className="navbar-item">
            <NavLink to="/" className="navbar-link">
              Home
            </NavLink>
          </li>
          <li className="navbar-item">
            <NavLink to="/lost-items" className="navbar-link">
              Lost Items
            </NavLink>
          </li>
          <li className="navbar-item">
            <NavLink to="/found-items" className="navbar-link">
              Found Items
            </NavLink>
          </li>

          {user ? (
            <>
              <li className="navbar-item">
                <NavLink to="/report-item" className="navbar-link report-button">
                  📋 Report Item
                </NavLink>
              </li>
              <li className="navbar-item">
                <NavLink to="/my-items" className="navbar-link">
                  My Items
                </NavLink>
              </li>
              {user.role === 'admin' && (
                <li className="navbar-item">
                  <NavLink to="/admin" className="navbar-link">
                    Admin
                  </NavLink>
                </li>
              )}
              <li className="navbar-item">
                <NavLink to="/profile" className="navbar-link">
                  <span className="user-greeting">Hello, {user.name}</span>
                </NavLink>
              </li>
              <li className="navbar-item">
                <button onClick={handleLogout} className="navbar-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="navbar-item">
                <NavLink to="/login" className="navbar-link">
                  Login
                </NavLink>
              </li>
              <li className="navbar-item">
                <NavLink to="/register" className="navbar-link">
                  Register
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
