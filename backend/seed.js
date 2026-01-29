require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/Product");

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

// Product data from frontend
const products = [
  {
    name: "Organic Fertilizer",
    price: 250,
    image: "images/organic.png",
    description: "Eco-friendly fertilizer made from natural compost. Improves soil health and boosts crop yield.",
    category: "Fertilizers",
    stock: 100
  },
  {
    name: "Nitrogen Fertilizer",
    price: 300,
    image: "images/nitrogen.png",
    description: "High-quality nitrogen-based fertilizer to enhance leaf growth and greener crops.",
    category: "Fertilizers",
    stock: 80
  },
  {
    name: "Hybrid Seeds Pack",
    price: 150,
    image: "images/hybrid.png",
    description: "High-yielding hybrid seeds that ensure better germination and crop resilience.",
    category: "Seeds",
    stock: 200
  },
  {
    name: "Wheat Seeds",
    price: 180,
    image: "images/wheat.png",
    description: "Premium quality wheat seeds for higher yield and resistance to pests.",
    category: "Seeds",
    stock: 150
  },
  {
    name: "Crop Protection Spray",
    price: 320,
    image: "images/spray.png",
    description: "Protects plants from harmful insects and fungal infections. Safe and effective.",
    category: "Pesticides",
    stock: 60
  },
  {
    name: "Insecticide Liquid",
    price: 400,
    image: "images/insecticide.png",
    description: "Powerful insecticide that ensures crop protection against pests and insects.",
    category: "Pesticides",
    stock: 45
  },
  {
    name: "Phosphorus Fertilizer",
    price: 600,
    image: "images/phosphorus.png",
    description: "Boosts root development and enhances flowering and fruiting in crops.",
    category: "Fertilizers",
    stock: 70
  },
  {
    name: "Potassium Fertilizer",
    price: 700,
    image: "images/potassium.png",
    description: "Improves drought resistance and strengthens plant immune system.",
    category: "Fertilizers",
    stock: 65
  },
  {
    name: "Chlorpyrifos 20 EC",
    price: 380,
    image: "images/chlorpyrifos.png",
    description: "Broad-spectrum insecticide used to control termites, borers, and sucking pests in crops.",
    category: "Pesticides",
    stock: 40
  },
  {
    name: "Bifenthrin 8 SC",
    price: 420,
    image: "images/bifenthrin.png",
    description: "Effective insecticide for controlling aphids, mites, whiteflies and other crop-damaging insects.",
    category: "Pesticides",
    stock: 35
  },
  {
    name: "NPK Fertilizer 10-10-10",
    price: 450,
    image: "images/npk.png",
    description: "Balanced NPK liquid fertilizer that improves plant growth, root development and crop yield.",
    category: "Fertilizers",
    stock: 90
  },
  {
    name: "DAP Fertilizer 18-46-0",
    price: 1350,
    image: "images/dap.png",
    description: "High phosphorus fertilizer that promotes strong root growth and early plant development.",
    category: "Fertilizers",
    stock: 50
  },
  {
    name: "Urea Fertilizer 46-0-0",
    price: 1200,
    image: "images/Urea.png",
    description: "Nitrogen-rich fertilizer that boosts leaf growth and increases crop productivity.",
    category: "Fertilizers",
    stock: 75
  },
  {
    name: "Potash Fertilizer",
    price: 1250,
    image: "images/potash.png",
    description: "Potassium rich fertilizer that improves crop quality, drought tolerance and disease resistance.",
    category: "Fertilizers",
    stock: 55
  },
  {
    name: "Vermicompost Fertilizer",
    price: 550,
    image: "images/vermicompost.png",
    description: "Organic fertilizer made from earthworms that improves soil fertility and plant growth naturally.",
    category: "Fertilizers",
    stock: 85
  },
  {
    name: "Bio Fertilizer Bottle",
    price: 350,
    image: "images/biofertilizer.png",
    description: "Microbial based fertilizer that enhances nutrient absorption and improves soil health.",
    category: "Fertilizers",
    stock: 95
  },
  {
    name: "Liquid Bio Fertilizer",
    price: 420,
    image: "images/liquidbio.png",
    description: "Liquid bio fertilizer that boosts crop yield and promotes sustainable farming practices.",
    category: "Fertilizers",
    stock: 80
  }
];

// Seed function
const seedProducts = async () => {
  try {
    // Clear existing products
    await Product.deleteMany({});
    console.log("Cleared existing products");

    // Insert new products
    const createdProducts = await Product.insertMany(products);
    console.log(`Seeded ${createdProducts.length} products successfully`);

    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

// Run seeder
connectDB().then(() => {
  seedProducts();
});