// Ultra-simple test function
module.exports = (req, res) => {
  res.status(200).json({
    message: "Simple test working!",
    timestamp: new Date().toISOString()
  });
};
