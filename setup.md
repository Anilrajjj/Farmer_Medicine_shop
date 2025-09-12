# Setup Instructions

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd farmer-medicine-shop
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   - Copy `backend/config/environment.js` to `backend/.env`
   - Update the values in `.env` file:
     ```env
     MONGO_URI=mongodb://127.0.0.1:27017/farmershop
     JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production
     PORT=5000
     NODE_ENV=development
     FRONTEND_URL=http://localhost:3000
     ```

4. **Start MongoDB**
   - Install MongoDB locally or use MongoDB Atlas
   - Make sure MongoDB is running on the configured URI

5. **Run the application**
   ```bash
   # Development mode
   npm run dev
   
   # Or production mode
   npm start
   ```

6. **Access the application**
   - Backend API: http://localhost:5000
   - Frontend: Open `frontend/index.html` in your browser

## Project Structure

```
farmer-medicine-shop/
├── backend/                 # Node.js/Express API
│   ├── config/             # Configuration files
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   └── server.js           # Main server file
├── frontend/               # HTML/CSS/JS frontend
│   ├── index.html          # Main page
│   ├── cart.html           # Shopping cart
│   ├── checkout.html       # Checkout page
│   └── ...                 # Other pages
└── package.json            # Root package.json
```

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/products` - Get all products
- `POST /api/orders` - Place an order

## Troubleshooting

1. **MongoDB Connection Issues**
   - Ensure MongoDB is running
   - Check the MONGO_URI in your .env file
   - Verify network connectivity

2. **Port Already in Use**
   - Change the PORT in .env file
   - Kill existing processes using the port

3. **Missing Dependencies**
   - Run `npm run install-all` again
   - Check Node.js version (>=14.0.0)
