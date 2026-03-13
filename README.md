# Farmer Medicine Shop

## Professional Overview
Farmer Medicine Shop is a comprehensive, full-stack e-commerce platform specifically tailored for the agricultural sector. It bridges the gap between agricultural suppliers and digital consumers, providing a robust marketplace for seeds, fertilizers, pesticides, and farming tools. The system ensures a secure, seamless shopping experience through resilient authentication mechanisms, integrated payment gateways, and real-time email-based order tracking, all wrapped in a maintainable MVC-inspired system architecture.

## Key Features
- **Multi-Role Access Control**: distinct interfaces and permissions for Farmers, Customers, and Administrators.
- **Product Catalog Management**: Dynamic categorization, inventory tracking, and stock management.
- **Flexible Authentication**: Secure login supporting traditional email/password, Google OAuth, and Phone OTP (via Firebase).
- **Cart & Order Processing**: Persistent shopping cart, extensive checkout flow with saved address management.
- **Integrated Payments**: Support for Stripe, Razorpay, and Cash on Delivery (COD).
- **Automated Notifications**: Fault-tolerant email messaging pipeline using Nodemailer (SMTP) and Resend API.
- **Admin Dashboard**: Specialized administrative functionality for overseeing users, catalog, and fulfilling orders.

## Technology Stack

### Frontend
- **Core**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Architecture**: Single Page Application (SPA) feel using native DOM manipulation and Fetch API.

### Backend
- **Core Environment**: Node.js
- **Framework**: Express.js
- **Architecture**: MVC-inspired RESTful API design (`models/`, `routes/`, `services/`, `middleware/`).

### Database
- **Database Engine**: MongoDB
- **Object Data Modeling (ODM)**: Mongoose

### Authentication
- **Strategy**: JSON Web Tokens (JWT)
- **Security**: `bcryptjs` for password hashing
- **Third-Party Integrations**: Firebase Authentication for OAuth and OTP

### External Services
- **Payments**: Stripe Checkout API, Razorpay Integration
- **Storage**: Cloudinary (for secure product image hosting)
- **Messaging**: Nodemailer, Resend API (Order updates and confirmations)
- **Utilities**: Multer (file uploads)

### Deployment
- **Configuration**: Monolithic static serving. The Express backend serves the static frontend assets natively, making the entire application easily hostable on a single Node.js instance (Render, Vercel, DigitalOcean, Heroku).

---

## Project Architecture

The application implements a decoupled client-server pattern. The client utilizes Vanilla JS interacting with the robust RESTful Express API via Fetch requests.

```text
Client (Web Browser)
       ↓  (HTTP/REST Requests)
Frontend Application (Vanilla JS / HTML / CSS)
       ↓  (Fetch API with Bearer Tokens)
Backend API (Express.js)
       ↓  (Route Handling & Middleware)
Authentication Layer (JWT / Firebase / bcrypt)
       ↓  (Controllers & Services Layer)
Business Logic (Order Management, Email Services, Payments)
       ↓  (Mongoose ORM)
Database (MongoDB)
       ↓
External Services (Stripe, Razorpay, Cloudinary, SMTP/Resend)
```

---

## Authentication Flow

The application secures endpoints using stateless JWTs reinforced by rigorous middleware.

1. **User Login**: The user authenticates via traditional email/password, Google OAuth, or Firebase Phone OTP.
2. **Backend Verification**: The backend validates credentials using `bcrypt` or decodes the Firebase UID.
3. **Token Generation**: The server mints a signed JSON Web Token (JWT) embedding user identity and role.
4. **Client Storage**: The frontend stores the token locally.
5. **Protected Access**: Subsequent API requests include the JWT in the `Authorization: Bearer <token>` header, verified iteratively by custom auth middleware (`authenticateToken`, `requireAdmin`).

---

## API Overview

The backend exposes a well-structured REST API. Here are the core endpoints:

### Authentication (`/api/auth`)
- `POST /api/auth/login` — Authenticate user and yield JWT.
- `POST /api/auth/signup` — Register a new standard user or farmer.
- `POST /api/auth/google-login` — Authenticate utilizing Google OAuth payload.
- `POST /api/auth/firebase-login` — Authenticate via Mobile OTP payload.
- `GET /api/auth/profile` — Retrieve authenticated user profile.

### Products (`/api/products`)
- `GET /api/products` — Retrieve product catalog with pagination, sorting, and search.
- `GET /api/products/:id` — Fetch product details by ID.
- `POST /api/products/add` — (Admin) Add a new product with Cloudinary image upload.
- `PATCH /api/products/:id/stock` — (Admin) Update product inventory levels.

### Orders (`/api/orders`)
- `POST /api/orders/place` — Initiate a new customer order.
- `GET /api/orders/my-orders` — Retrieve personalized order history.
- `GET /api/orders/admin/all` — (Admin) Comprehensive view of system-wide orders.
- `PATCH /api/orders/:id/status` — (Admin) Transition order state and trigger automated customer emails.
- `PATCH /api/orders/:id/cancel` — Cancel pending orders.

### Payments (`/api/payment`)
- `POST /api/payment/razorpay/create-order` — Initialize Razorpay transaction.
- `POST /api/payment/stripe/create-payment-intent` — Initialize Stripe transaction.

---

## Database Design

The schema follows best-practice normalization suitable for NoSQL document stores:

- **Users**: Flexible document structure handling varied profiles (`farmer`, `customer`). Fields include authentication credentials, RBAC `role`, business/farm metadata, and arrays for `savedAddresses`.
- **Products**: Contains `name`, `price`, string Enum `category` (Fertilizers, Seeds, Pesticides, Tools), `stock`, `image` URL, and `isActive` for soft deletion.
- **Orders**: Embedded document structure tracking line `items` (snapshot of Product state at purchase time), hierarchical `shippingAddress`, monetary `totalAmount`, `paymentMethod`, and `status` ENUM tracking the fulfillment cycle.

**Relationships**: Orders contain a reference (`ObjectId`) to the User, while caching Product properties internally to decouple historical orders from future product updates.

---

## Order Management Workflow

1. **Discovery**: Authenticated user browses paginated agricultural products.
2. **Staging**: User adds desired quantities to the local shopping cart.
3. **Checkout Selection**: User passes shipping details, utilizing previously saved addresses, and selects payment (Stripe/Razorpay/COD).
4. **Confirmation**: Order is successfully persisted to MongoDB. An automated confirmation HTML email is asynchronously dispatched via Nodemailer.
5. **Fulfillment Loop**: System Admin dashboard receives the order. The Admin adjusts the system status (`Pending` → `Processing` → `Shipped` → `Delivered`).
6. **Notification Update**: Each status mutation selectively triggers an automated email conveying localized delivery tracking to the customer.

---

## Admin System

The platform features a restricted, highly functional Admin module accessed via `/admin.html`. The backend enforces security exclusively via the `requireAdmin` middleware. 
Admin capabilities include:
- Generating new inventory with direct image integration to Cloudinary.
- Toggling product visibility via soft-deletes.
- Observing system-wide commercial throughput.
- Progressing the operational lifecycle of orders, interfacing directly with the automated Mail Service pipeline.

---

## Deployment

The system is optimized for monolithic cloud deployment where the backend inherently binds and serves the client UI.

### Production Environment Strategy:
1. Express utilizes `app.use(express.static('../frontend'))`.
2. Traffic resolves natively through the unified process mapped to port 5001/80.
3. Designed cleanly for modern PaaS solutions like **Render**, **Railway**, or **Heroku**.

---

## Local Development Setup

Follow these steps to develop locally:

### 1. Prerequisites
- Node.js (v20.x+)
- MongoDB instance (Local or Atlas)

### 2. Installation
Clone the repository, then install full-stack dependencies safely from the root:
```bash
npm run install-all
```

### 3. Environment Configuration
Create a `.env` file within the `backend/` directory referencing `.env.example`:
```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
FRONTEND_URL=http://localhost:5001

# Payments (Optional)
STRIPE_SECRET_KEY=your_stripe_key
RAZORPAY_KEY_ID=your_razorpay_key

# Email Service (Optional for testing)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
RESEND_API_KEY=your_resend_key
```

### 4. Database Seeding (Optional)
Execute the seed script to populate initial agricultural products:
```bash
cd backend && npm run seed
```

### 5. Running the Application
Start the Node server from the root directory:
```bash
npm run dev
```
Navigate to `http://localhost:5001` to view your functional Farmer Medicine Shop.

---

## Engineering Highlights

- **Hybrid Authentication Interoperability**: Flawlessly integrates third-party Firebase OAuth and OTP protocols directly into a custom JWT authorization regime representing high-security adaptability.
- **Fault-Tolerant Micro-Services Approach**: The `emailService.js` embodies resilient engineering by abstracting SMTP, seamlessly falling back to the Resend API, and absorbing network timeouts asynchronously without blocking critical API transactions.
- **Production-Ready API Architecture**: Incorporates robust cross-origin resource sharing (CORS), dedicated error-handling middleware, IPv4 DNS prioritization, and graceful environmental config binding.
- **Role-Based Access Control (RBAC)**: Enforces meticulous backend restrictions, ensuring uncompromised administrative boundary preservation across a multi-tenant user base.
- **Data Integrity & Scalability**: Mongoose schemas leverage soft-deletes (`isActive`) avoiding relational constraint breaking, while explicitly versioning historical data inside the Order document.
