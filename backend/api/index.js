// Ultra-clean Vercel function - no external dependencies
module.exports = (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  try {
    // Basic health check
    if (req.url === '/api/health' || req.url === '/api/health/') {
      res.status(200).json({
        message: "Farmer Medicine Shop API is running!",
        status: "healthy",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || "development"
      });
      return;
    }
    
    // Root endpoint
    if (req.url === '/' || req.url === '') {
      res.status(200).json({
        message: "Farmer Medicine Shop API",
        status: "running",
        endpoints: {
          health: "/api/health",
          test: "/api/test"
        },
        timestamp: new Date().toISOString()
      });
      return;
    }
    
    // Test endpoint
    if (req.url === '/api/test' || req.url === '/api/test/') {
      res.status(200).json({
        message: "Test endpoint working!",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || "development"
      });
      return;
    }
    
    // 404 for other routes
    res.status(404).json({
      message: "Route not found",
      url: req.url,
      method: req.method
    });
    
  } catch (error) {
    console.error("Function error:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
};