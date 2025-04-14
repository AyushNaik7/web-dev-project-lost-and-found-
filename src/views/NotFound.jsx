// src/views/NotFound.jsx
import { Link } from 'react-router-dom';
import '../assets/css/main.css';

const NotFound = () => {
  return (
    <div className="container" style={{ textAlign: 'center', padding: '50px 0' }}>
      <h1 style={{ fontSize: '72px', marginBottom: '20px' }}>404</h1>
      <h2 style={{ marginBottom: '30px' }}>Page Not Found</h2>
      <p style={{ marginBottom: '30px', fontSize: '18px' }}>
        The page you are looking for does not exist or has been moved.
      </p>
      <Link to="/" className="btn btn-primary">
        Go to Home
      </Link>
    </div>
  );
};

export default NotFound;
