import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

// Import CSS files
import './assets/css/main.css'
import './assets/css/app.css'
import './assets/css/navbar.css'
import './assets/css/auth.css'
import './assets/css/items.css'
import './assets/css/footer.css'
import './assets/css/home.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
