const express = require("express");
const Product = require("../models/Product");
const { authenticateToken, requireAdmin } = require("../middleware/auth");
const { upload, uploadToCloudinary, deleteFromCloudinary } = require("../utils/imageUpload");

const router = express.Router();

// GET ALL PRODUCTS (public)
router.get("/", (req, res) => {
  try {
    const { category, search, sort, page = 1, limit = 20 } = req.query;

    let products = Product.find();

    // Filter by category
    if (category && category !== 'all') {
      products = products.filter(p => p.category === category);
    }

    // Search functionality
    if (search) {
      const regex = new RegExp(search, 'i');
      products = products.filter(p => regex.test(p.name) || regex.test(p.description));
    }

    // Sorting
    if (sort === 'price_asc') {
      products.sort((a, b) => a.price - b.price);
    } else if (sort === 'price_desc') {
      products.sort((a, b) => b.price - a.price);
    } else if (sort === 'name_asc') {
      products.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === 'name_desc') {
      products.sort((a, b) => b.name.localeCompare(a.name));
    } else {
      // Default sort by id desc (assuming higher id is newer)
      products.sort((a, b) => b.id - a.id);
    }

    const total = products.length;

    // Pagination
    const skip = (page - 1) * limit;
    products = products.slice(skip, skip + parseInt(limit));

    res.json({
      products,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalProducts: total,
        hasNext: skip + parseInt(limit) < total,
        hasPrev: page > 1
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET SINGLE PRODUCT (public)
router.get("/:id", (req, res) => {
  try {
    const product = Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET PRODUCTS BY CATEGORY (public)
router.get("/category/:category", (req, res) => {
  try {
    const products = Product.find({ category: req.params.category });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ADD PRODUCT (admin only)
router.post("/add", authenticateToken, requireAdmin, upload.single('image'), async (req, res) => {
  try {
    let imageUrl = '';

    // Upload image to Cloudinary if provided
    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer);
      imageUrl = uploadResult.url;
    }

    const productData = {
      ...req.body,
      image: imageUrl || req.body.image, // Use uploaded image or provided URL
      id: Date.now() // Simple ID generation
    };

    const product = new Product(productData);
    product.save();

    res.status(201).json({ message: "Product added successfully", product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE PRODUCT (admin only)
router.put("/:id", authenticateToken, requireAdmin, upload.single('image'), async (req, res) => {
  try {
    const product = Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let imageUrl = product.image;

    // Upload new image to Cloudinary if provided
    if (req.file) {
      // Delete old image if it exists
      if (product.image && product.image.includes('cloudinary')) {
        const publicId = product.image.split('/').pop().split('.')[0];
        await deleteFromCloudinary(publicId);
      }

      const uploadResult = await uploadToCloudinary(req.file.buffer);
      imageUrl = uploadResult.url;
    }

    const productData = {
      ...req.body,
      image: imageUrl
    };

    const updatedProduct = Product.findByIdAndUpdate(
      req.params.id,
      productData,
      { new: true }
    );

    res.json({ message: "Product updated successfully", product: updatedProduct });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE PRODUCT (admin only - soft delete)
router.delete("/:id", authenticateToken, requireAdmin, (req, res) => {
  try {
    const product = Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET ALL PRODUCTS FOR ADMIN (admin only - includes inactive)
router.get("/admin/all", authenticateToken, requireAdmin, (req, res) => {
  try {
    const products = Product.findAll().sort((a, b) => b.id - a.id);
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE STOCK (admin only)
router.patch("/:id/stock", authenticateToken, requireAdmin, (req, res) => {
  try {
    const { stock } = req.body;
    const product = Product.findByIdAndUpdate(
      req.params.id,
      { stock },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Stock updated successfully", product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
