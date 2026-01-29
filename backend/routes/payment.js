const express = require("express");
const { createRazorpayOrder, verifyRazorpayPayment, createStripePaymentIntent } = require("../utils/payment");
const { authenticateToken } = require("../middleware/auth");
const Order = require("../models/Order");

const router = express.Router();

// CREATE RAZORPAY ORDER
router.post("/razorpay/create-order", authenticateToken, async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Valid amount is required" });
    }

    const order = await createRazorpayOrder(amount);

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error("Razorpay order creation error:", error);
    res.status(500).json({ message: "Failed to create payment order" });
  }
});

// VERIFY RAZORPAY PAYMENT
router.post("/razorpay/verify", authenticateToken, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    const isValid = verifyRazorpayPayment(razorpay_order_id, razorpay_payment_id, razorpay_signature);

    if (!isValid) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    // Update order payment status
    if (orderId) {
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: 'Paid'
      });
    }

    res.json({ message: "Payment verified successfully" });
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({ message: "Payment verification failed" });
  }
});

// CREATE STRIPE PAYMENT INTENT
router.post("/stripe/create-payment-intent", authenticateToken, async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Valid amount is required" });
    }

    const paymentIntent = await createStripePaymentIntent(amount);

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    console.error("Stripe payment intent creation error:", error);
    res.status(500).json({ message: "Failed to create payment intent" });
  }
});

// CONFIRM STRIPE PAYMENT
router.post("/stripe/confirm", authenticateToken, async (req, res) => {
  try {
    const { paymentIntentId, orderId } = req.body;

    // In a real implementation, you'd verify the payment with Stripe
    // For now, we'll just update the order status

    if (orderId) {
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: 'Paid'
      });
    }

    res.json({ message: "Payment confirmed successfully" });
  } catch (error) {
    console.error("Payment confirmation error:", error);
    res.status(500).json({ message: "Payment confirmation failed" });
  }
});

module.exports = router;