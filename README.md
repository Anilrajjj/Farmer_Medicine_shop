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
FarmerShop/
│── frontend/
│   ├── home.html
│   ├── cart.html
│   ├── checkout.html
│   ├── order-confirmation.html
│   ├── login.html
│   ├── signup.html
│   ├── about.html
│   ├── style.css
│   ├── checkout.css
│   ├── order-confirm.css
│   └── script.js
│
│── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── order.js
│   ├── server.js
│   └── config/
│       └── db.js
│
│── package.json
│── README.md

⚙️ Installation

Clone the repository:

git clone https://github.com/your-username/farmer-shop.git
cd farmer-shop


Install dependencies:

npm install


Start MongoDB locally or connect to MongoDB Atlas.

🔑 Environment Variables

Create a .env file in the root directory and add:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000

▶️ Running the Project

Start the backend server:

npm start


Open the frontend files (home.html) in your browser or serve them with Live Server.

📡 API Endpoints
🔹 Auth Routes

POST /api/auth/register – Register a new user

POST /api/auth/login – Login user

POST /api/auth/logout – Logout user

🔹 Order Routes

POST /api/orders – Place an order

GET /api/orders/:userId – Get orders by user

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
