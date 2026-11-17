const mongoose = require("mongoose");

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.error("❌ MONGO_URI is not set. Add it to backend/.env (see .env.example).");
    process.exit(1);
  }
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 100, // Handle up to 100 concurrent connections
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB Error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
