// Payment utilities - Razorpay and Stripe
const createRazorpayOrder = async (amount) => {
  if (!process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID === 'your-razorpay-key-id') {
    throw new Error("Razorpay not configured. Add RAZORPAY_KEY_ID to .env");
  }
  const Razorpay = require("razorpay");
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
  return razorpay.orders.create({
    amount: amount * 100, // Convert to paise
    currency: "INR",
    receipt: `receipt_${Date.now()}`
  });
};

const verifyRazorpayPayment = (orderId, paymentId, signature) => {
  const crypto = require("crypto");
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
  return expectedSignature === signature;
};

const createStripePaymentIntent = async (amount) => {
  if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === 'your-stripe-secret-key') {
    throw new Error("Stripe not configured. Add STRIPE_SECRET_KEY to .env");
  }
  const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
  return stripe.paymentIntents.create({
    amount: amount * 100,
    currency: "inr"
  });
};

module.exports = { createRazorpayOrder, verifyRazorpayPayment, createStripePaymentIntent };
