const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors({
  origin: "*",
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get("/api/health", (req, res) => {
  try {
    res.json({ 
      message: "Farmer Medicine Shop API is running!", 
      status: "healthy",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development"
    });
  } catch (error) {
    console.error("Health check error:", error);
    res.status(500).json({ error: "Health check failed" });
  }
});

// Root endpoint
app.get("/", (req, res) => {
  try {
    res.json({ 
      message: "Farmer Medicine Shop API", 
      status: "running",
      endpoints: {
        health: "/api/health",
        test: "/api/test"
      }
    });
  } catch (error) {
    console.error("Root endpoint error:", error);
    res.status(500).json({ error: "Root endpoint failed" });
  }
});

// Test endpoint
app.get("/api/test", (req, res) => {
  try {
    res.json({
      message: "Test endpoint working!",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development"
    });
  } catch (error) {
    console.error("Test endpoint error:", error);
    res.status(500).json({ error: "Test endpoint failed" });
  }
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  res.status(500).json({ 
    message: "Something went wrong!", 
    error: err.message,
    timestamp: new Date().toISOString()
  });
});

// Export for Vercel
module.exports = app;
