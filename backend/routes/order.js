const express = require("express");
const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");
const { authenticateToken, requireAdmin } = require("../middleware/auth");
const { sendOrderConfirmation, sendOrderStatusUpdate } = require("../services/emailService");

const router = express.Router();

function resolveEmailName(user, shippingAddress) {
  const shippingName = (shippingAddress && shippingAddress.fullName ? String(shippingAddress.fullName) : "").trim();
  if (shippingName) return shippingName;
  const profileName = `${user?.firstName || ""} ${user?.lastName || ""}`.trim();
  return profileName || "Valued Customer";
}

// PLACE ORDER (logged-in users only)
router.post("/place", authenticateToken, async (req, res) => {
  try {
    const { items, totalAmount, shippingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0)
      return res.status(400).json({ message: "No items in order" });
    if (!shippingAddress || !shippingAddress.fullName)
      return res.status(400).json({ message: "Shipping address is required" });

    const newOrder = new Order({
      user: req.user._id,
      items,
      totalAmount,
      shippingAddress,
      paymentMethod: paymentMethod || "Cash on Delivery",
      paymentStatus: "Pending"
    });

    await newOrder.save();

    // Send order confirmation email (non-blocking)
    try {
      const user = await User.findById(req.user._id).select("email firstName lastName");
      if (user && user.email) {
        const userName = resolveEmailName(user, shippingAddress);
        sendOrderConfirmation(user.email, userName, newOrder).catch(() => { });
      }
    } catch (emailErr) {
      console.error("Email fetch error:", emailErr.message);
    }

    res.status(201).json({
      message: "Order placed successfully!",
      orderId: newOrder._id,
      order: newOrder
    });
  } catch (err) {
    console.error("Order error:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
});

// GET USER ORDERS (authenticated users only)
router.get("/my-orders", authenticateToken, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.productId")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET SINGLE ORDER (user can view their own orders, admin can view all)
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("items.productId");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if user owns this order or is admin
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET ALL ORDERS (admin only)
router.get("/admin/all", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    let query = {};
    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate("user", "firstName lastName email")
      .populate("items.productId", "name price")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(query);

    res.json({
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalOrders: total
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE ORDER STATUS (admin only) — sends email notification to user
router.patch("/:id/status", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("user", "firstName lastName email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Send status update email (non-blocking)
    try {
      if (order.user && order.user.email) {
        const userName = resolveEmailName(order.user, order.shippingAddress);
        sendOrderStatusUpdate(order.user.email, userName, order, status).catch(() => { });
      }
    } catch (emailErr) {
      console.error("Status email error:", emailErr.message);
    }

    res.json({ message: "Order status updated successfully", order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// CANCEL ORDER (user can cancel their pending orders)
router.patch("/:id/cancel", authenticateToken, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if user owns this order
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Only allow cancellation of pending orders
    if (order.status !== "Pending") {
      return res.status(400).json({ message: "Cannot cancel order that is already processed" });
    }

    order.status = "Cancelled";
    await order.save();

    // Send cancellation email (non-blocking)
    try {
      const user = await User.findById(req.user._id).select("email firstName lastName");
      if (user && user.email) {
        const userName = resolveEmailName(user, order.shippingAddress);
        sendOrderStatusUpdate(user.email, userName, order, "Cancelled").catch(() => { });
      }
    } catch (emailErr) {
      console.error("Cancel email error:", emailErr.message);
    }

    res.json({ message: "Order cancelled successfully", order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE ORDER (user can delete their own cancelled orders)
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Only allow deletion of cancelled orders
    if (order.status !== "Cancelled") {
      return res.status(400).json({ message: "Only cancelled orders can be deleted" });
    }

    await Order.findByIdAndDelete(req.params.id);

    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
