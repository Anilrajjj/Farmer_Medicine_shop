const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Mock data for testing
const mockProducts = [
  {
    id: 1,
    name: "Organic Fertilizer",
    price: 250,
    description: "Eco-friendly fertilizer made from natural compost",
    category: "Fertilizers",
    image: "images/organic.png"
  },
  {
    id: 2,
    name: "Nitrogen Fertilizer", 
    price: 300,
    description: "High-quality nitrogen-based fertilizer",
    category: "Fertilizers",
    image: "images/nitrogen.png"
  }
];

// Routes
app.get("/api/health", (req, res) => {
  res.json({ 
    message: "Farmer Medicine Shop API is running!", 
    status: "healthy",
    mode: "test (no database)"
  });
});

app.get("/api/products", (req, res) => {
  res.json(mockProducts);
});

app.post("/api/auth/login", (req, res) => {
  res.json({ 
    message: "Login endpoint (mock)", 
    token: "mock-jwt-token",
    user: { id: 1, name: "Test User" }
  });
});

app.post("/api/auth/register", (req, res) => {
  res.json({ 
    message: "Registration endpoint (mock)",
    user: { id: 1, name: req.body.name || "Test User" }
  });
});

app.post("/api/orders", (req, res) => {
  res.json({ 
    message: "Order placed successfully (mock)",
    orderId: Math.floor(Math.random() * 1000)
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Test Server running at http://localhost:${PORT}`);
  console.log(`📊 Mode: Test (No Database Required)`);
  console.log(`🔗 Health Check: http://localhost:${PORT}/api/health`);
});


