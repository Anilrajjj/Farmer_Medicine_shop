// Production configuration
module.exports = {
  // MongoDB Atlas connection string (replace with your actual Atlas URI)
  MONGO_URI: process.env.MONGO_URI || "mongodb+srv://username:password@cluster.mongodb.net/farmershop?retryWrites=true&w=majority",
  
  // JWT Secret (should be a strong, random string in production)
  JWT_SECRET: process.env.JWT_SECRET || "your_super_secret_jwt_key_here_change_this_in_production",
  
  // Server configuration
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || "production",
  
  // CORS configuration for production
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",
  
  // Get the correct API URL for production
  getApiUrl: function() {
    return `http://localhost:${this.PORT}`;
  }
};
