// Simple test endpoint for Vercel
module.exports = (req, res) => {
  res.status(200).json({
    message: "Test endpoint working!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development"
  });
};
