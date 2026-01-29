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

    // Check if phone number already exists
    const existingPhoneUser = await User.findOne({ mobileNumber });
    if (existingPhoneUser) {
      return res.status(400).json({ message: "User with this phone number already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user with basic information
    const newUser = new User({
      firstName,
      lastName,
      mobileNumber,
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

    // Find user by phone number
    let user = await User.findOne({ mobileNumber: phoneNumber });

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

module.exports = router;
