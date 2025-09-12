// Environment Configuration
// Copy this file to .env in the backend directory and update the values

module.exports = {
  // Database Configuration
  MONGO_URI: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/farmershop",
  
  // JWT Configuration
  JWT_SECRET: process.env.JWT_SECRET || "your_super_secret_jwt_key_here_change_this_in_production",
  
  // Server Configuration
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",
  
  // Frontend URL (for CORS)
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000"
};
