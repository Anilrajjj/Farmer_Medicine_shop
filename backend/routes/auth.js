const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// ADMIN REGISTRATION (for initial setup)
router.post("/register-admin", async (req, res) => {
  try {
    const { firstName, lastName, email, mobileNumber, password } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "First name, last name, email, and password are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin user
    const newAdmin = new User({
      firstName,
      lastName,
      email,
      mobileNumber,
      password: hashedPassword,
      role: 'admin',
      userType: 'customer'
    });

    await newAdmin.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: newAdmin._id, email: newAdmin.email, role: newAdmin.role },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "Admin account created successfully!",
      token,
      user: {
        id: newAdmin._id,
        email: newAdmin.email,
        firstName: newAdmin.firstName,
        role: newAdmin.role
      }
    });

  } catch (err) {
    console.error("Admin registration error:", err);
    res.status(500).json({ message: "Server error during admin registration" });
  }
});

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      mobileNumber,
      password,
      userType,
      farmName,
      farmLocation,
      farmSize,
      farmDescription,
      businessName,
      businessType,
      businessDescription,
      address,
      preferences
    } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "First name, last name, email, and password are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user with all provided data
    const newUser = new User({
      firstName,
      lastName,
      email,
      mobileNumber,
      password: hashedPassword,
      userType: userType || 'customer',
      // Farmer fields
      farmName,
      farmLocation,
      farmSize,
      farmDescription,
      // Customer fields
      businessName,
      businessType,
      businessDescription,
      // Address
      address: address || {},
      // Preferences
      preferences: preferences || { newsletter: true, smsUpdates: false }
    });

    await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "Account created successfully!",
      token,
      user: {
        id: newUser._id,
        email: newUser.email,
        firstName: newUser.firstName,
        userType: newUser.userType,
        role: newUser.role
      }
    });

  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Server error during registration" });
  }
});

// SIGNUP (simplified)
router.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, mobileNumber, email, password, firebaseUID, phoneVerified } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !mobileNumber || !email || !password) {
      return res.status(400).json({ message: "First name, last name, mobile number, email, and password are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    // ✅ Normalize phone number before saving (always store without +91)
    const normalizedMobile = mobileNumber.replace(/^\+91/, '');

    // Check if phone number already exists (check both formats)
    const existingPhoneUser = await User.findOne({
      mobileNumber: { $in: [normalizedMobile, '+91' + normalizedMobile] }
    });
    if (existingPhoneUser) {
      return res.status(400).json({ message: "User with this phone number already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user with basic information
    const newUser = new User({
      firstName,
      lastName,
      mobileNumber: normalizedMobile,
      email,
      password: hashedPassword,
      firebaseUID: firebaseUID || null,
      phoneVerified: phoneVerified || false
    });

    await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "Account created successfully!",
      token,
      user: {
        id: newUser._id,
        email: newUser.email,
        firstName: newUser.firstName,
        phoneVerified: newUser.phoneVerified
      }
    });

  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error during signup" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        role: user.role
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// FIREBASE PHONE LOGIN
router.post("/firebase-login", async (req, res) => {
  try {
    const { phoneNumber, firebaseUID } = req.body;

    if (!phoneNumber || !firebaseUID) {
      return res.status(400).json({ message: "Phone number and Firebase UID are required" });
    }

    // ✅ Normalize phone number — try both formats (+918861691360 and 8861691360)
    const normalizedPhone = phoneNumber.replace(/^\+91/, ''); // strip +91 → "8861691360"
    const fullPhone = '+91' + normalizedPhone;               // ensure full → "+918861691360"

    let user = await User.findOne({
      mobileNumber: { $in: [normalizedPhone, fullPhone, phoneNumber] }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found. Please sign up first." });
    }

    // Update Firebase UID if not set
    if (!user.firebaseUID) {
      user.firebaseUID = firebaseUID;
      await user.save();
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        mobileNumber: user.mobileNumber,
        role: user.role
      }
    });
  } catch (err) {
    console.error("Firebase login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// RESET PASSWORD
router.post("/reset", async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "User not found" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// GOOGLE LOGIN / SIGNUP
router.post("/google-login", async (req, res) => {
  try {
    const { googleUID, email, firstName, lastName, photoURL } = req.body;

    if (!googleUID || !email) {
      return res.status(400).json({ message: "Google UID and email are required" });
    }

    // Check if user already exists
    let user = await User.findOne({ $or: [{ email }, { googleUID }] });

    if (user) {
      // Update googleUID if not set
      if (!user.googleUID) {
        user.googleUID = googleUID;
        await user.save();
      }
    } else {
      // Create new user from Google account (no password needed)
      user = new User({
        firstName: firstName || 'User',
        lastName: lastName || '',
        email,
        mobileNumber: '',
        password: await require('bcryptjs').hash(googleUID + Date.now(), 10), // random password
        googleUID,
        phoneVerified: false
      });
      await user.save();
    }

    const token = require('jsonwebtoken').sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "7d" }
    );

    res.json({
      message: "Google login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (err) {
    console.error("Google login error:", err);
    res.status(500).json({ message: "Server error during Google login" });
  }
});

module.exports = router;
