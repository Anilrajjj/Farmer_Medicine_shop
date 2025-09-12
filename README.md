🌾 Farmer Shop – Online Agriculture E-Commerce

Farmer Shop is a full-stack e-commerce application where farmers and customers can buy agricultural products (seeds, fertilizers, pesticides, medicines, tools). The project mimics Flipkart/Amazon-like flow with authentication, cart, checkout, and order management stored in MongoDB.

📌 Table of Contents

Features

Tech Stack

Project Structure

Installation

Environment Variables

Running the Project

API Endpoints

Screenshots

Future Enhancements

Contributing

License

🚀 Features

👨‍🌾 User Authentication – Signup, Login, Logout (stored in MongoDB).

🛒 Cart System – Add/remove products, update quantities.

🔍 Search & Suggestions – Find products instantly.

💳 Checkout Page – Collects shipping address & payment method.

✅ Order Confirmation Page – Displays summary of placed order.

📦 Order Storage – Stores order details in MongoDB with schema.

🖼️ Responsive UI – Styled with CSS for modern look.

🔐 Secure Passwords – Hashed with bcrypt.

🛠 Tech Stack

Frontend: HTML, CSS, JavaScript

Backend: Node.js, Express.js

Database: MongoDB with Mongoose

Authentication: JWT & bcrypt

Version Control: Git + GitHub

📂 Project Structure
Farmer_Medicine_shop/
│── frontend/
│   ├── index.html
│   ├── cart.html
│   ├── checkout.html
│   ├── order-confirmation.html
│   ├── login.html
│   ├── signup.html
│   ├── about.html
│   ├── forget.html
│   ├── style.css
│   ├── checkout.css
│   ├── order-confirm.css
│   ├── script.js
│   └── images/
│
│── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Order.js
│   │   └── Product.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── order.js
│   │   └── product.js
│   ├── config/
│   │   ├── db.js
│   │   └── environment.js
│   ├── server.js
│   ├── package.json
│   └── vercel.json
│
│── package.json
│── README.md

⚙️ Installation

Clone the repository:

```bash
git clone https://github.com/your-username/farmer-medicine-shop.git
cd farmer-medicine-shop
```

Install dependencies:

```bash
# Install all dependencies (backend and frontend)
npm run install-all

# Or install separately:
npm run install-backend
npm run install-frontend
```

Start MongoDB locally or connect to MongoDB Atlas.

🔑 Environment Variables

Create a `.env` file in the `backend` directory and add:

```env
MONGO_URI=mongodb://127.0.0.1:27017/farmershop
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

▶️ Running the Project

Start the backend server:

```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

Open the frontend files (`index.html`) in your browser or serve them with Live Server.

📡 API Endpoints

🔹 Health Check
- GET `/api/health` – Check API status

🔹 Auth Routes
- POST `/api/auth/register` – Register a new user
- POST `/api/auth/login` – Login user
- POST `/api/auth/logout` – Logout user

🔹 Product Routes
- GET `/api/products` – Get all products
- POST `/api/products/add` – Add a new product (admin)

🔹 Order Routes
- POST `/api/orders` – Place an order
- GET `/api/orders/:userId` – Get orders by user

📸 Screenshots
🏠 Home Page

Products listing with add to cart option.

🛒 Cart Page

View & manage items before checkout.

💳 Checkout Page

Enter shipping and payment details.

✅ Order Confirmation

Order successfully placed with details.

🌟 Future Enhancements

Admin Dashboard (add/manage products).

Online Payment Gateway (Razorpay/Stripe).

Order Tracking System.

Push Notifications / Email confirmations.

Progressive Web App (PWA) support.

🤝 Contributing

Fork the repo

Create a feature branch (git checkout -b feature-xyz)

Commit your changes (git commit -m "Added new feature")

Push to branch (git push origin feature-xyz)

Open a Pull Request

📜 License

This project is licensed under the MIT License.# Farmer_Medicine_shop
