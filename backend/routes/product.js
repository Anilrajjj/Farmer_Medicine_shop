const express = require("express");
const Product = require("../models/Product");
const { authenticateToken, requireAdmin } = require("../middleware/auth");
const { upload, uploadToCloudinary, deleteFromCloudinary } = require("../utils/imageUpload");

const router = express.Router();

// GET ALL PRODUCTS (public)
router.get("/", async (req, res) => {
  try {
    const { category, search, sort, page = 1, limit = 100 } = req.query;

    let query = { isActive: true };

    if (category && category !== "all") {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sort === "price_asc") sortOption = { price: 1 };
    else if (sort === "price_desc") sortOption = { price: -1 };
    else if (sort === "name_asc") sortOption = { name: 1 };
    else if (sort === "name_desc") sortOption = { name: -1 };

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      products,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalProducts: total,
        hasNext: (page - 1) * limit + products.length < total,
        hasPrev: page > 1
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET ALL PRODUCTS FOR ADMIN (admin only - includes inactive)
// ⚠️ Must come BEFORE /:id to avoid conflict
router.get("/admin/all", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET SINGLE PRODUCT (public)
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product || !product.isActive) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ADD PRODUCT (admin only)
router.post("/add", authenticateToken, requireAdmin, upload.single("image"), async (req, res) => {
  try {
    let imageUrl = req.body.image || "";
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      imageUrl = result.url;
    }

    const product = new Product({ ...req.body, image: imageUrl });
    await product.save();

    res.status(201).json({ message: "Product added successfully", product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE PRODUCT (admin only)
router.put("/:id", authenticateToken, requireAdmin, upload.single("image"), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let imageUrl = product.image;
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      imageUrl = result.url;
    }

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body, image: imageUrl },
      { new: true }
    );

    res.json({ message: "Product updated successfully", product: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE PRODUCT (admin only - soft delete)
router.delete("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE STOCK (admin only)
router.patch("/:id/stock", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { stock: req.body.stock },
      { new: true }
    );
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Stock updated successfully", product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
