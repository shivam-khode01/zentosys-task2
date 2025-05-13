# Task1: Todo App

A modern, responsive Todo application built with React and TailwindCSS that includes task management features and dark/light theme support.

![Todo App Screenshot](https://via.placeholder.com/800x450.png?text=Todo+App+Screenshot)

## Features

- ✅ Create new tasks
- ✅ Delete existing tasks
- ✅ Edit tasks inline
- ✅ Mark tasks as completed with visual strike-through
- ✅ Filter tasks by All/Completed/Pending status
- ✅ Responsive design for all device sizes
- ✅ Dark/Light theme toggle with system preference detection
- ✅ Task persistence using localStorage
- ✅ Accessible UI with proper contrast and ARIA attributes

## Live Demo

[View Live Demo](https://your-demo-link-here.netlify.app) (Replace with your actual deployment link)

## Getting Started

### Prerequisites

- Node.js (v14.0.0 or later)
- npm or yarn package manager

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/task1-todo-app.git
   cd task1-todo-app
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server
   ```bash
   npm start
   # or
   yarn start
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
todo-app/
├── node_modules/
├── public/
│   ├── favicon.ico
│   ├── index.html
│   └── ...
├── src/
│   ├── App.js           # Main application wrapper
│   ├── TodoApp.jsx      # Todo application component
│   ├── index.css        # Global styles with Tailwind directives
│   ├── index.js         # Application entry point
│   └── ...
├── package.json
├── tailwind.config.js   # Tailwind configuration
└── postcss.config.js    # PostCSS configuration
```

## Tech Stack

- **React** - Frontend library
- **TailwindCSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **localStorage API** - For data persistence

## Setup Instructions

### 1. Create React App

```bash
npx create-react-app todo-app
cd todo-app
```

### 2. Install Dependencies

```bash
npm install lucide-react
npm install -D tailwindcss postcss autoprefixer
```

### 3. Initialize Tailwind CSS

```bash
npx tailwindcss init -p
```

### 4. Configure Tailwind CSS

Update your `tailwind.config.js` file:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### 5. Add Tailwind Directives

Update your `src/index.css` file:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 6. Create TodoApp Component

Create `TodoApp.jsx` in the src directory and paste the component code.

### 7. Update App.js

Update your `src/App.js` file:

```javascript
import TodoApp from './TodoApp';

function App() {
  return (
    <div className="App">
      <TodoApp />
    </div>
  );
}

export default App;
```

## Usage

- Type your task in the input field and press Enter or click the + button to add it
- Click the checkbox to mark a task as completed
- Hover over a task to reveal edit and delete options
- Use the filter buttons to view All, Pending, or Completed tasks
- Click the sun/moon icon to toggle between light and dark themes

## Future Enhancements

- Firebase authentication for user-specific todos
- Cloud synchronization of todos across devices
- Task categories or labels
- Due dates and reminders
- Task prioritization
- Drag and drop reordering

# Task 2 : eCommerce Application API Schema

This documentation outlines the database schema and API endpoints for the eCommerce application. The application uses MongoDB as the database with Mongoose for schema definition and validation.

## Database Schema

### User Collection

```javascript
{
  name: String,          // Required, user's full name
  email: String,         // Required, unique, valid email format
  password: String,      // Required, min 6 chars, stored as bcrypt hash
  role: String,          // Enum: 'customer', 'vendor', 'admin', default 'customer'
  address: {             // Optional user address information
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  createdAt: Date        // Auto-generated timestamp
}
```

### Product Collection

```javascript
{
  name: String,          // Required, max 100 chars
  description: String,   // Required, max 1000 chars
  price: Number,         // Required, positive number
  stock: Number,         // Required, non-negative, default 0
  category: String,      // Required, predefined categories
  vendorId: ObjectId,    // Required, reference to User with role 'vendor'
  images: [String],      // Array of image URLs
  featured: Boolean,     // Default false
  rating: Number,        // Default 0, between 0-5
  numReviews: Number,    // Default 0
  createdAt: Date,       // Auto-generated timestamp
  updatedAt: Date        // Updated on each save
}
```

### Cart Collection

```javascript
{
  userId: ObjectId,      // Required, reference to User, unique
  items: [{              // Array of cart items
    product: ObjectId,   // Required, reference to Product
    quantity: Number,    // Required, min 1, default 1
    price: Number,       // Required, product price at time of adding
    name: String,        // Product name snapshot
    image: String        // Product image snapshot
  }],
  total: Number,         // Auto-calculated sum of (price * quantity)
  updatedAt: Date        // Updated on each save
}
```

### Order Collection

```javascript
{
  userId: ObjectId,      // Required, reference to User
  items: [{              // Array of order items
    product: ObjectId,   // Required, reference to Product
    name: String,        // Required, product name snapshot
    quantity: Number,    // Required, min 1
    price: Number,       // Required, product price at time of order
    image: String        // Product image snapshot
  }],
  shippingAddress: {     // Required shipping information
    street: String,      // Required
    city: String,        // Required
    state: String,       // Required
    zipCode: String,     // Required
    country: String      // Required
  },
  paymentInfo: {         // Payment details
    method: String,      // Required, enum: 'credit_card', 'paypal', etc.
    transactionId: String, // Optional
    status: String       // Enum: 'pending', 'completed', 'failed', 'refunded'
  },
  status: String,        // Order status: 'pending', 'processing', 'shipped', etc.
  totalAmount: Number,   // Required, total order amount
  tax: Number,           // Default 0
  shippingFee: Number,   // Default 0
  createdAt: Date,       // Auto-generated timestamp
  updatedAt: Date,       // Updated on each save
  deliveredAt: Date      // Set when order is delivered
}
```

## API Endpoints

### Authentication Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/updatedetails` - Update user details
- `PUT /api/auth/updatepassword` - Update password

### User Endpoints

- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get single user (admin only)
- `PUT /api/users/:id` - Update user (admin only)
- `DELETE /api/users/:id` - Delete user (admin only)

### Product Endpoints

- `GET /api/products` - Get all products with filtering, pagination
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create new product (vendor/admin only)
- `PUT /api/products/:id` - Update product (owner vendor/admin only)
- `DELETE /api/products/:id` - Delete product (owner vendor/admin only)
- `GET /api/products/vendor/:vendorId` - Get products by vendor

### Cart Endpoints

- `GET /api/cart` - Get current user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:productId` - Update cart item quantity
- `DELETE /api/cart/:productId` - Remove item from cart
- `DELETE /api/cart` - Clear cart

### Order Endpoints

- `GET /api/orders` - Get all orders (user: own orders, admin: all orders)
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create new order from cart
- `PUT /api/orders/:id/status` - Update order status (admin/vendor only)
- `GET /api/orders/user/:userId` - Get user orders (admin only)

## Main Features

1. **User Authentication & Authorization**
   - Secure password storage with bcrypt
   - Role-based access control (customer, vendor, admin)
   - JWT authentication

2. **Product Management**
   - CRUD operations for products
   - Category filtering
   - Search functionality
   - Vendor-specific product listings

3. **Shopping Cart**
   - Add/remove products
   - Update quantities
   - Price calculation
   - Cart persistence

4. **Order Processing**
   - Order creation from cart
   - Order status tracking
   - Order history

5. **Admin Dashboard**
   - User management
   - Order management
   - Product oversight

## Vendor-Specific API

The API includes a specialized endpoint to fetch all products of a specific vendor:

- `GET /api/products/vendor/:vendorId`

This endpoint:
- Validates that the vendorId corresponds to a valid vendor
- Supports pagination
- Allows filtering by category
- Returns product data along with pagination info

# 🚀 Task 3: Secure Notes API

This project implements a **secure Notes API** using **Node.js**, **Express**, **MongoDB**, and **JWT** authentication.

Users can:
- Register and log in
- Create, read, update, and delete personal notes
- Access only their own notes via JWT-based authentication

## 🔐 Features

- ✅ User registration and login using JWT
- ✅ Create, Read, Update, Delete (CRUD) for notes
- ✅ User-based authentication: each user can access only their notes
- ✅ Basic validation (e.g., note title required)
- ✅ MongoDB + Mongoose for data storage
- ✅ Express for API routing

## 📁 Folder Structure
project/
├── controllers/
│ ├── authController.js
│ └── notesController.js
├── models/
│ ├── User.js
│ └── Note.js
├── routes/
│ ├── authRoutes.js
│ └── notesRoutes.js
├── middleware/
│ └── authMiddleware.js
├── .env
├── app.js
├── package.json
└── README.md

## 🔧 Setup Instructions

### 1. Clone the Repo

```bash
git clone https://github.com/yourusername/secure-notes-api.git
cd secure-notes-api
npm install
3. Create a .env File
npm start
```
Server will be running at http://localhost:5000.

🔐 API Endpoints
🔸 Auth Routes
POST /api/auth/register → Register user

POST /api/auth/login → Login user and receive JWT

🔸 Notes Routes (Requires JWT)
GET /api/notes → Get all notes for the logged-in user

POST /api/notes → Create a new note

PUT /api/notes/:id → Update a note

DELETE /api/notes/:id → Delete a note

Note: Send JWT in the header as Authorization: Bearer <token>

✅ Validation Rules
Title is required for each note.

JWT token is required for accessing any /notes routes.

🧱 Tech Stack
Node.js

Express.js

MongoDB & Mongoose

JSON Web Token (JWT)

dotenv

# Task 4: Weather CLI Tool

A command-line tool that fetches and displays current weather information for any city using the OpenWeatherMap API.

## Features

- **Real-time Weather Data**: Fetches current weather conditions from OpenWeatherMap
- **Detailed Information**: Displays temperature, weather condition, wind speed and direction, humidity, and atmospheric pressure
- **Visual Indicators**: Shows weather icons using Unicode symbols
- **Smart Caching**: Saves API calls by storing recent queries in a local JSON file for 30 minutes
- **Cardinal Directions**: Converts wind direction degrees to cardinal points (N, NE, E, etc.)
- **Easy Cache Management**: Option to clear the cache with a simple command-line flag

## Installation

1. Clone this repository or download the files
2. Install dependencies:
   ```bash
   npm install
   ```
3. Get a free API key from [OpenWeatherMap](https://openweathermap.org/api)
4. Edit `weather.js` and replace `YOUR_OPENWEATHERMAP_API_KEY` with your actual API key
5. Make the script executable (Unix/Linux/macOS):
   ```bash
   chmod +x weather.js
   ```

## Usage

### Check weather for a city:
```bash
node weather.js London
```

### Install globally for easier access:
```bash
npm install -g .
weather Paris
```

### Clear the cache:
```bash
node weather.js --clear-cache
```

### Get help:
```bash
node weather.js --help
```

## Sample Output

```
Weather for London, GB
========================================
Temperature: 12.5°C (Feels like: 10.8°C)
Condition: Partly cloudy
Wind: 4.6 m/s, SW (225°)
Humidity: 76%
Pressure: 1015 hPa

Current weather: ☁ Partly cloudy
```

## Technical Details

- Built with Node.js
- Uses the Commander.js library for command-line argument handling
- Implements file-based caching to reduce API calls
- Handles various error scenarios gracefully
- Designed with user experience in mind

## Requirements

- Node.js 12.0 or higher
- Internet connection for API calls
- OpenWeatherMap API key (free tier works fine)

- # Trello-lite Project Management App

A full-stack project management application with drag-and-drop task management, user authentication, and responsive design.

## Tech Stack

### Frontend
- Next.js 14 (App Router)
- TailwindCSS for styling
- react-beautiful-dnd for drag and drop functionality
- SWR for data fetching and caching

### Backend
- Express.js server
- MongoDB database with Mongoose ODM
- JWT for authentication
- Bcrypt for password hashing

## Features

- 🔐 User authentication (register, login, logout)
- 📋 Create and manage boards
- 📝 Create lists within boards
- ✅ Create tasks within lists
- 🔄 Drag and drop tasks between lists
- 👥 Assign tasks to users
- 📱 Responsive design for mobile and desktop
- 📊 Activity logs and timestamps

## Project Structure

```
trello-lite/
├── client/                # Next.js frontend
│   ├── app/               # App router pages
│   ├── components/        # React components
│   ├── context/           # React context providers
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions
│   ├── public/            # Static assets
│   └── styles/            # Global styles
│
├── server/                # Express backend
│   ├── config/            # Configuration files
│   ├── controllers/       # Route controllers
│   ├── middlewares/       # Custom middlewares
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   └── utils/             # Utility functions
│
├── .env                   # Environment variables
├── .gitignore             # Git ignore file
├── package.json           # Root package.json
└── README.md              # Project documentation
```

## Getting Started

### Prerequisites
- Node.js 16.x or higher
- MongoDB (local installation or MongoDB Atlas)

### Installation

1. Clone the repository
2. Install dependencies for both client and server:
   ```bash
   # Install root dependencies
   npm install
   
   # Install client dependencies
   cd client
   npm install
   
   # Install server dependencies
   cd ../server
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the root directory
   - Add the following variables:
     ```
     MONGODB_URI=mongodb://localhost:27017/trello-lite
     JWT_SECRET=your_jwt_secret
     PORT=5000
     ```

4. Start the development servers:
   ```bash
   # Start both client and server in development mode
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `POST /api/auth/logout` - Logout a user

### Boards
- `GET /api/boards` - Get all boards for a user
- `POST /api/boards` - Create a new board
- `GET /api/boards/:id` - Get a specific board
- `PUT /api/boards/:id` - Update a board
- `DELETE /api/boards/:id` - Delete a board

### Lists
- `GET /api/boards/:boardId/lists` - Get all lists in a board
- `POST /api/boards/:boardId/lists` - Create a new list
- `PUT /api/lists/:id` - Update a list
- `DELETE /api/lists/:id` - Delete a list

### Tasks
- `GET /api/lists/:listId/tasks` - Get all tasks in a list
- `POST /api/lists/:listId/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task
- `PATCH /api/tasks/:id/move` - Move a task to a different list

### Users
- `GET /api/users` - Get all users (for task assignment)
- `GET /api/users/:id` - Get a specific user

## Deployment

The application can be deployed to various platforms:

- Frontend: Vercel, Netlify
- Backend: Heroku, Railway, Render
- Database: MongoDB Atlas
