import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './views/components/Navbar';
import Footer from './views/components/Footer';
import Home from './views/Home';
import Login from './views/auth/Login';
import Register from './views/auth/Register';
import Profile from './views/auth/Profile';
import ItemsList from './views/items/ItemsList';
import ItemDetail from './views/items/ItemDetail';
import ItemForm from './views/items/ItemForm';
import ThankYouPage from './views/items/ThankYouPage';
import NotFound from './views/NotFound';
import './assets/css/main.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/lost-items" element={<ItemsList type="lost" />} />
            <Route path="/found-items" element={<ItemsList type="found" />} />
            <Route path="/my-items" element={<ItemsList type="my" />} />
            <Route path="/items/:id" element={<ItemDetail />} />
            <Route path="/report-item" element={<ItemForm />} />
            <Route path="/edit-item/:id" element={<ItemForm isEdit={true} />} />
            <Route path="/thank-you" element={<ThankYouPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
