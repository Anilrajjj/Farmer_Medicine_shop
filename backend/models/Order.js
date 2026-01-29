const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  items: [
    {
      productId: { type: String, required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      image: { type: String },
    }
  ],

  totalAmount: { type: Number, required: true },

  shippingAddress: {
    fullName: { type: String, required: true },
    area: { type: String, required: true },
    landmark: { type: String },
    pincode: { type: String, required: true },
    phone: { type: String, required: true },
  },

  paymentMethod: { type: String, enum: ["COD", "Card", "UPI"], default: "COD" },
  paymentStatus: { type: String, enum: ["Pending", "Paid", "Failed", "Refunded"], default: "Pending" },
  status: { type: String, enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"], default: "Pending" },
}, { timestamps: true });

module.exports = mongoose.model("Order", OrderSchema);
