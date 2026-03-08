const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || "mongodb+srv://aniltech095_db_user:vGQbYV0yHenIuiTl@farmermedicineshop.fcol5zo.mongodb.net/?appName=FARMERMEDICINESHOP", {
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
