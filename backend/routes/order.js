const express = require("express");
const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");

const router = express.Router();

// PLACE ORDER
router.post("/place", async (req, res) => {
  try {
    const { email, items, totalAmount, shippingAddress, paymentMethod } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    // Optional: Validate products
    for (let i = 0; i < items.length; i++) {
      const product = await Product.findById(items[i].productId);
      if (!product) return res.status(400).json({ message: `Product not found: ${items[i].name}` });
    }

    const newOrder = new Order({
      user: user._id,
      items,
      totalAmount,
      shippingAddress,
      paymentMethod,
    });

    await newOrder.save();
    res.status(201).json({ message: "Order placed successfully!", orderId: newOrder._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET USER ORDERS
router.get("/my-orders/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const orders = await Order.find({ user: user._id })
                              .populate("items.productId")
                              .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
