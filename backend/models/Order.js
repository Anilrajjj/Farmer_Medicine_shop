const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      image: { type: String },
    }
  ],

  totalAmount: { type: Number, required: true },

  shippingAddress: {
    fullName: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    phone: { type: String, required: true },
  },

  paymentMethod: { type: String, enum: ["COD", "Card", "UPI"], default: "COD" },
  status: { type: String, enum: ["Pending", "Processing", "Shipped", "Delivered"], default: "Pending" },
}, { timestamps: true });

module.exports = mongoose.model("Order", OrderSchema);
