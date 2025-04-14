# Lost and Found System

A web application for managing lost and found items, built with React, Node.js, Express, and MongoDB.

## Features

- User authentication (register, login, profile management)
- Report lost or found items
- Search and filter items
- Notify item owners when someone knows where their lost item is
- Admin dashboard for managing categories
- Responsive design with smooth animations

## Tech Stack

### Frontend
- React
- React Router
- Axios
- CSS (custom styling)

### Backend
- Node.js
- Express
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs for password hashing

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)

## Installation

1. Clone the repository
```
git clone <repository-url>
cd lost-and-found
```

2. Install dependencies for both frontend and backend
```
npm install
cd backend
npm install
cd ..
```

3. Set up environment variables
   - Create a `.env` file in the backend directory
   - Add the following variables:
   ```
   MONGODB_URI=mongodb://localhost:27017/lostfound
   PORT=5000
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=30d
   ```

4. Seed the database with initial data
```
cd backend
npm run seed
cd ..
```

## Running the Application

### Development Mode
To run both frontend and backend concurrently:
```
npm run start
```

To run only the frontend:
```
npm run dev
```

To run only the backend:
```
npm run server
```

### Production Mode
To build the frontend for production:
```
npm run build
```

To start the backend server:
```
cd backend
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/updatedetails` - Update user details
- `PUT /api/auth/updatepassword` - Update user password

### Items
- `GET /api/items` - Get all items
- `GET /api/items/:id` - Get single item
- `POST /api/items` - Create new item
- `PUT /api/items/:id` - Update item
- `DELETE /api/items/:id` - Delete item
- `GET /api/items/status/:status` - Get items by status
- `GET /api/items/user/me` - Get current user's items
- `POST /api/items/:id/notifications` - Add location notification

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get single category
- `POST /api/categories` - Create new category (admin only)
- `PUT /api/categories/:id` - Update category (admin only)
- `DELETE /api/categories/:id` - Delete category (admin only)

## Default Users

After seeding the database, you can use the following credentials to login:

### Admin User
- Email: admin@example.com
- Password: admin123

### Regular User
- Email: john@example.com
- Password: password123

## License

This project is licensed under the MIT License.
