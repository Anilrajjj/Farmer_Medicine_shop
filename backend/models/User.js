const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobileNumber: { type: String, required: true },
  password: { type: String, required: true },
  firebaseUID: { type: String },
  phoneVerified: { type: Boolean, default: false },

  // Role-based access control
  role: { type: String, enum: ['user', 'admin'], default: 'user' },

  // User type and role-specific information
  userType: { type: String, enum: ['farmer', 'customer'], default: 'customer' },

  // Farmer-specific fields
  farmName: { type: String },
  farmLocation: { type: String },
  farmSize: { type: String, enum: ['small', 'medium', 'large'] },
  farmDescription: { type: String },

  // Customer-specific fields
  businessName: { type: String },
  businessType: { type: String },
  businessDescription: { type: String },

  // Address information
  address: {
    line1: { type: String },
    line2: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String }
  },

  // User preferences
  preferences: {
    newsletter: { type: Boolean, default: true },
    smsUpdates: { type: Boolean, default: false }
  },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", UserSchema);
