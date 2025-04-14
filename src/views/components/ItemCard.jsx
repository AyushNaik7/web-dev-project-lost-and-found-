// src/views/components/ItemCard.jsx
import { Link } from 'react-router-dom';
import '../../assets/css/items.css';

const ItemCard = ({ item }) => {
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

  // Default image if none provided
  const imageUrl = item.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image';

  return (
    <div className="item-card">
      <img src={imageUrl} alt={item.title} className="item-image" />
      <div className="item-content">
        <h3 className="item-title">{item.title}</h3>
        <div>
          <span className="item-category">{item.category}</span>
          <span className={`item-status ${getStatusClass(item.status)}`}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </span>
        </div>
        <p className="item-location">
          <strong>Location:</strong> {item.location}
        </p>
        <p className="item-date">
          <strong>Date:</strong> {formatDate(item.date)}
        </p>
        <p className="item-description">
          {item.description.length > 100
            ? `${item.description.substring(0, 100)}...`
            : item.description}
        </p>
        <div className="item-footer">
          <Link to={`/items/${item._id}`} className="btn btn-primary">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
