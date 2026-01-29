# 🌾 Farmer Shop – Online Agriculture E-Commerce

Farmer Shop is a production-ready full-stack e-commerce application for agricultural products (seeds, fertilizers, pesticides, medicines, tools). Built with modern technologies including MongoDB Atlas, JWT authentication, payment gateways, and a comprehensive admin dashboard.

## 📌 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Environment Setup](#-environment-setup)
- [Running the Project](#-running-the-project)
- [API Endpoints](#-api-endpoints)
- [Admin Dashboard](#-admin-dashboard)
- [Payment Integration](#-payment-integration)
- [Deployment](#-deployment)
- [Testing](#-testing)
- [Contributing](#-contributing)
- [License](#-license)

## 🚀 Features

### 👨‍🌾 User Features
- **User Authentication** – Secure signup, login, logout with JWT tokens
- **Role-based Access** – Separate interfaces for users and admins
- **Product Browsing** – Category filtering, search, and sorting
- **Cart Management** – Add/remove products, quantity updates
- **Order History** – View past orders with status tracking
- **Secure Checkout** – Address collection and payment processing
- **Order Confirmation** – Detailed order summaries

### 🛠️ Admin Features
- **Admin Dashboard** – Comprehensive management interface
- **Product Management** – CRUD operations for products
- **Order Management** – View and update order statuses
- **User Management** – Monitor user accounts
- **Analytics** – Sales statistics and insights
- **Image Upload** – Cloudinary integration for product images

### 💳 Payment & Security
- **Multiple Payment Gateways** – Razorpay and Stripe integration
- **Secure Passwords** – bcrypt hashing
- **JWT Authentication** – Token-based security
- **Input Validation** – Server-side validation
- **CORS Protection** – Cross-origin security

### 📱 Technical Features
- **Responsive Design** – Mobile-friendly UI
- **RESTful APIs** – Well-structured backend endpoints
- **MongoDB Atlas** – Cloud database integration
- **Image Storage** – Cloudinary CDN
- **Error Handling** – Comprehensive error management
- **Loading States** – Better user experience

## 🛠 Tech Stack

### Frontend
- **HTML5** – Semantic markup
- **CSS3** – Modern styling with responsive design
- **Vanilla JavaScript** – ES6+ features, async/await
- **Fetch API** – REST API communication

### Backend
- **Node.js** – Runtime environment
- **Express.js** – Web framework
- **MongoDB Atlas** – Cloud database
- **Mongoose** – ODM for MongoDB

### Authentication & Security
- **JWT** – JSON Web Tokens
- **bcrypt** – Password hashing
- **CORS** – Cross-origin resource sharing

### Payment Integration
- **Razorpay** – Indian payment gateway
- **Stripe** – International payment gateway

### Image Storage
- **Cloudinary** – Cloud image storage and CDN

### Development Tools
- **Nodemon** – Development auto-restart
- **Git** – Version control

## 📁 Project Structure

```
farmer-medicine-shop/
│
├── frontend/
│   ├── index.html              # Home page with product listing
│   ├── cart.html               # Shopping cart page
│   ├── checkout.html           # Checkout form
│   ├── order-confirmation.html # Order success page
│   ├── order-history.html      # User order history
│   ├── login.html              # User login
│   ├── signup.html             # User registration
│   ├── admin.html              # Admin dashboard
│   ├── about.html              # About page
│   ├── forget.html             # Password reset
│   ├── style.css               # Main styles
│   ├── checkout.css            # Checkout styles
│   ├── order-confirm.css       # Confirmation styles
│   ├── script.js               # Main frontend logic
│   ├── admin.js                # Admin dashboard logic
│   ├── js/
│   │   └── config.js           # API configuration
│   └── images/                 # Static images
│
├── backend/
│   ├── models/
│   │   ├── User.js             # User schema
│   │   ├── Product.js          # Product schema
│   │   └── Order.js            # Order schema
│   ├── routes/
│   │   ├── auth.js             # Authentication routes
│   │   ├── product.js          # Product CRUD routes
│   │   ├── order.js            # Order management routes
│   │   └── payment.js          # Payment processing routes
│   ├── services/               # Business logic services
│   ├── utils/                  # Utility functions
│   ├── config/
│   │   ├── db.js               # Database connection
│   │   └── environment.js      # Environment configuration
│   ├── middleware/             # Custom middleware
│   ├── server.js               # Main server file
│   ├── server-test.js          # Test server
│   ├── package.json            # Backend dependencies
│   └── .env.example            # Environment template
│
├── package.json                # Root package.json
├── setup.md                    # Setup instructions
└── README.md                   # This file
```

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB Atlas** account (or local MongoDB)
- **Git** for version control
- **Cloudinary** account (for image uploads)
- **Razorpay/Stripe** accounts (for payments)

## ⚙️ Installation

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/farmer-medicine-shop.git
cd farmer-medicine-shop
```

### 2. Install Dependencies
```bash
# Install all dependencies (backend and frontend)
npm run install-all

# Or install separately:
npm run install-backend    # Install backend dependencies
npm run install-frontend   # Install frontend dependencies (if any)
```

### 3. Environment Setup
See [Environment Setup](#-environment-setup) section below.

### 4. Start the Application
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

## 🔧 Environment Setup

### 1. Create Environment File
Copy the example environment file and configure it:

```bash
cd backend
cp .env.example .env
```

### 2. Configure Environment Variables
Edit `backend/.env` with your actual values:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/farmer-medicine-shop?retryWrites=true&w=majority

# JWT Secret (generate a strong random string)
JWT_SECRET=your-super-secret-jwt-key-here-minimum-32-characters

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Razorpay (for Indian payments)
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret

# Stripe (for international payments)
STRIPE_SECRET_KEY=your-stripe-secret-key

# Email Service (optional)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### 3. MongoDB Atlas Setup
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Whitelist your IP address
5. Update `MONGODB_URI` in `.env`

### 4. Payment Gateway Setup
- **Razorpay**: Get API keys from Razorpay Dashboard
- **Stripe**: Get API keys from Stripe Dashboard

### 5. Cloudinary Setup
1. Create a Cloudinary account
2. Get your cloud name, API key, and API secret
3. Update the environment variables

## ▶️ Running the Project

### Development Mode
```bash
# Start backend with auto-restart
npm run dev
```

### Production Mode
```bash
# Build and start
npm start
```

### Frontend Development
Open `frontend/index.html` in your browser or use a local server:

```bash
# Using Python (if available)
python -m http.server 3000

# Using Node.js live-server
npx live-server frontend --port=3000

# Using VS Code Live Server extension
# Right-click on index.html → Open with Live Server
```

### Admin Setup
1. Register as admin: Use the registration endpoint with admin role
2. Access admin dashboard at `/admin.html`
3. Manage products, orders, and view analytics

## 📡 API Endpoints

### 🔹 Health Check
- `GET /api/health` – API status check

### 🔹 Authentication
- `POST /api/auth/register` – User registration
- `POST /api/auth/login` – User login
- `POST /api/auth/logout` – User logout
- `GET /api/auth/profile` – Get user profile

### 🔹 Products
- `GET /api/products` – Get all products (with filtering)
- `GET /api/products/:id` – Get product by ID
- `POST /api/products` – Add new product (admin only)
- `PUT /api/products/:id` – Update product (admin only)
- `DELETE /api/products/:id` – Delete product (admin only)
- `POST /api/products/:id/upload` – Upload product image

### 🔹 Orders
- `POST /api/orders` – Create new order
- `GET /api/orders/user/:userId` – Get user's orders
- `GET /api/orders/:id` – Get order by ID (admin only)
- `PUT /api/orders/:id/status` – Update order status (admin only)
- `DELETE /api/orders/:id` – Cancel order

### 🔹 Payments
- `POST /api/payment/create-order` – Create payment order
- `POST /api/payment/verify` – Verify payment
- `POST /api/payment/webhook` – Payment webhook

## 👨‍💼 Admin Dashboard

Access the admin dashboard at `frontend/admin.html` after logging in as admin.

### Features:
- **Dashboard Overview** – Sales statistics, recent orders
- **Product Management** – Add, edit, delete products
- **Order Management** – View and update order statuses
- **User Management** – Monitor user accounts
- **Analytics** – Revenue charts and insights

### Admin Registration:
```bash
# Register first admin user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "admin123",
    "role": "admin"
  }'
```

## 💳 Payment Integration

### Supported Gateways:
- **Razorpay** – Preferred for Indian customers
- **Stripe** – For international payments

### Payment Flow:
1. User adds items to cart
2. Proceeds to checkout
3. Selects payment method
4. Redirected to payment gateway
5. Payment verification and order confirmation

### Testing Payments:
- **Razorpay Test Keys**: Use test API keys for development
- **Stripe Test Keys**: Use test mode for development

## 🚀 Deployment

### Backend Deployment (Railway/Render/Heroku)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

### Frontend Deployment (Vercel/Netlify)
```bash
# For static hosting
# Upload frontend/ folder to Netlify/Vercel
# Update FRONTEND_URL in backend environment
```

### Environment Variables for Production
- Set `NODE_ENV=production`
- Use production database URL
- Configure production payment keys
- Set up production Cloudinary account

### Build Commands
```bash
# Backend build (if needed)
npm run build

# Production start
npm start
```

## 🧪 Testing

### API Testing
```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Test authentication
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'
```

### Manual Testing Checklist
- [ ] User registration and login
- [ ] Product browsing and filtering
- [ ] Cart functionality
- [ ] Checkout process
- [ ] Payment integration
- [ ] Order history
- [ ] Admin dashboard access
- [ ] Product management (admin)
- [ ] Order management (admin)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add new feature'`
4. Push to branch: `git push origin feature-name`
5. Open a Pull Request

### Development Guidelines
- Follow ESLint configuration
- Write descriptive commit messages
- Test API endpoints thoroughly
- Update documentation for new features
- Maintain code quality standards

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ for farmers and agricultural communities**

For support or questions, please open an issue on GitHub.
