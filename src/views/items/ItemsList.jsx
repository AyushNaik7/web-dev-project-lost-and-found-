// src/views/items/ItemsList.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ItemCard from '../components/ItemCard';
import SearchFilter from '../components/SearchFilter';
import itemController from '../../controllers/ItemController';
import authController from '../../controllers/AuthController';
import '../../assets/css/items.css';

const ItemsList = ({ type }) => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const currentUser = authController.getCurrentUser();
    setUser(currentUser);

    // Load items based on type
    const fetchItems = async () => {
      try {
        let loadedItems = [];

        switch (type) {
          case 'lost':
            loadedItems = await itemController.getLostItems();
            break;
          case 'found':
            loadedItems = await itemController.getFoundItems();
            break;
          case 'my':
            loadedItems = await itemController.getMyItems();
            break;
          default:
            loadedItems = await itemController.getAllItems();
        }

        // Ensure loadedItems is an array
        if (!Array.isArray(loadedItems)) {
          console.error('Loaded items is not an array:', loadedItems);
          loadedItems = [];
        }

        setItems(loadedItems);
        setFilteredItems(loadedItems);
      } catch (error) {
        console.error('Error fetching items:', error);
        setItems([]);
        setFilteredItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, [type]);

  const handleSearch = async (query) => {
    try {
      if (!query.trim()) {
        setFilteredItems(items);
        return;
      }

      const searchResults = await itemController.searchItems(query);

      // Ensure searchResults is an array
      if (!Array.isArray(searchResults)) {
        console.error('Search results is not an array:', searchResults);
        setFilteredItems([]);
        return;
      }

      // Filter by type if needed
      let results = searchResults;
      if (type === 'lost') {
        results = searchResults.filter(item => item.status === 'lost');
      } else if (type === 'found') {
        results = searchResults.filter(item => item.status === 'found');
      } else if (type === 'my' && user) {
        results = searchResults.filter(item => item.reportedBy === user._id);
      }

      setFilteredItems(results);
    } catch (error) {
      console.error('Error searching items:', error);
      setFilteredItems([]);
    }
  };

  const handleFilter = async (filters) => {
    try {
      // Use the async filterItems method from the controller
      const filteredResults = await itemController.filterItems(filters);

      // Ensure filteredResults is an array
      if (!Array.isArray(filteredResults)) {
        console.error('Filtered results is not an array:', filteredResults);
        setFilteredItems([]);
        return;
      }

      // Apply additional filters based on the page type
      let results = filteredResults;

      // Filter by type if needed
      if (type === 'lost') {
        results = results.filter(item => item.status === 'lost');
      } else if (type === 'found') {
        results = results.filter(item => item.status === 'found');
      } else if (type === 'my' && user) {
        results = results.filter(item => item.reportedBy === user._id);
      }

      setFilteredItems(results);
    } catch (error) {
      console.error('Error filtering items:', error);
      setFilteredItems([]);
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'lost':
        return 'Lost Items';
      case 'found':
        return 'Found Items';
      case 'my':
        return 'My Items';
      default:
        return 'All Items';
    }
  };

  if (isLoading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="container items-container">
      <div className="items-header">
        <h2 className="items-title">{getTitle()}</h2>
        {user && (
          <Link to="/report-item" className="btn btn-report">
            📋 Report Item
          </Link>
        )}
      </div>

      <SearchFilter onSearch={handleSearch} onFilter={handleFilter} />

      {filteredItems.length === 0 ? (
        <div className="no-items">
          <h3>No items found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="items-grid">
          {filteredItems.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ItemsList;
