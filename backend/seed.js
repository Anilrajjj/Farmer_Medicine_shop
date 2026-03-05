const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const mongoose = require("mongoose");
const Product = require("./models/Product");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

const products = [
  // ===== FERTILIZERS =====
  { name: "Organic Fertilizer", price: 250, image: "images/organic.png", description: "Eco-friendly fertilizer made from natural compost. Improves soil health and boosts crop yield.", category: "Fertilizers", stock: 100 },
  { name: "Nitrogen Fertilizer", price: 300, image: "images/nitrogen.png", description: "High-quality nitrogen-based fertilizer to enhance leaf growth and greener crops.", category: "Fertilizers", stock: 80 },
  { name: "Phosphorus Fertilizer", price: 600, image: "images/phosphorus.png", description: "Boosts root development and enhances flowering and fruiting in crops.", category: "Fertilizers", stock: 70 },
  { name: "Potassium Fertilizer", price: 700, image: "images/potassium.png", description: "Improves drought resistance and strengthens plant immune system.", category: "Fertilizers", stock: 65 },
  { name: "NPK Fertilizer 10-10-10", price: 450, image: "images/npk.png", description: "Balanced NPK liquid fertilizer that improves plant growth, root development and crop yield.", category: "Fertilizers", stock: 90 },
  { name: "DAP Fertilizer 18-46-0", price: 1350, image: "images/dap.png", description: "High phosphorus fertilizer that promotes strong root growth and early plant development.", category: "Fertilizers", stock: 50 },
  { name: "Urea Fertilizer 46-0-0", price: 1200, image: "images/Urea.png", description: "Nitrogen-rich fertilizer that boosts leaf growth and increases crop productivity.", category: "Fertilizers", stock: 75 },
  { name: "Potash Fertilizer", price: 1250, image: "images/potash.png", description: "Potassium rich fertilizer that improves crop quality, drought tolerance and disease resistance.", category: "Fertilizers", stock: 55 },
  { name: "Vermicompost Fertilizer", price: 550, image: "images/vermicompost.png", description: "Organic fertilizer made from earthworms that improves soil fertility and plant growth naturally.", category: "Fertilizers", stock: 85 },
  { name: "Bio Fertilizer Bottle", price: 350, image: "images/biofertilizer.png", description: "Microbial based fertilizer that enhances nutrient absorption and improves soil health.", category: "Fertilizers", stock: 95 },
  { name: "Liquid Bio Fertilizer", price: 420, image: "images/liquidbio.png", description: "Liquid bio fertilizer that boosts crop yield and promotes sustainable farming practices.", category: "Fertilizers", stock: 80 },
  { name: "NPK Fertilizer 10-26-26", price: 1250, image: "images/npk102626.png", description: "High phosphorus NPK fertilizer that promotes strong root growth and flowering in crops.", category: "Fertilizers", stock: 60 },
  { name: "NPK Fertilizer 12-32-16", price: 1300, image: "images/npk123216.png", description: "Balanced fertilizer ideal for early plant growth and improved crop development.", category: "Fertilizers", stock: 60 },
  { name: "NPK Fertilizer 15-15-15", price: 1400, image: "images/npk151515.png", description: "All-purpose balanced fertilizer for uniform plant growth and improved yield.", category: "Fertilizers", stock: 60 },
  { name: "NPK Fertilizer 19-19-19", price: 1450, image: "images/npk191919.png", description: "Water soluble fertilizer that boosts plant growth and improves crop productivity.", category: "Fertilizers", stock: 60 },
  { name: "NPK Fertilizer 20-20-20", price: 1500, image: "images/npk202020.png", description: "Highly effective fertilizer that provides equal nutrients for fast plant growth.", category: "Fertilizers", stock: 60 },
  { name: "NPK Fertilizer 14-35-14", price: 1350, image: "images/npk143514.png", description: "Phosphorus rich fertilizer that supports root development and flowering stage.", category: "Fertilizers", stock: 60 },
  { name: "NPK Fertilizer 28-28-0", price: 1550, image: "images/npk282800.png", description: "Nitrogen and phosphorus rich fertilizer for rapid vegetative growth and strong crops.", category: "Fertilizers", stock: 60 },

  // ===== SEEDS =====
  { name: "Hybrid Seeds Pack", price: 150, image: "images/hybrid.png", description: "High-yielding hybrid seeds that ensure better germination and crop resilience.", category: "Seeds", stock: 200 },
  { name: "Wheat Seeds", price: 180, image: "images/wheat.png", description: "Premium quality wheat seeds for higher yield and resistance to pests.", category: "Seeds", stock: 150 },
  { name: "Tomato Hybrid Seeds", price: 180, image: "images/tomato.png", description: "High-yield hybrid tomato seeds with excellent germination and disease resistance.", category: "Seeds", stock: 120 },
  { name: "Onion Seeds", price: 160, image: "images/onion.png", description: "Premium quality onion seeds for uniform bulb size and higher yield.", category: "Seeds", stock: 130 },
  { name: "Chilli Seeds", price: 170, image: "images/chilli.png", description: "High-quality chilli seeds for spicy, healthy and high-yield crops.", category: "Seeds", stock: 110 },
  { name: "Brinjal (Eggplant) Seeds", price: 165, image: "images/brinjal.png", description: "Premium brinjal seeds with strong plant growth and improved fruit quality.", category: "Seeds", stock: 100 },
  { name: "Cabbage Seeds", price: 150, image: "images/cabbage.png", description: "High-quality cabbage seeds for uniform head formation and better yield.", category: "Seeds", stock: 100 },
  { name: "Cauliflower Seeds", price: 155, image: "images/cauliflower.png", description: "Premium cauliflower seeds with excellent curd quality and disease resistance.", category: "Seeds", stock: 100 },
  { name: "Carrot Seeds", price: 140, image: "images/carrot.png", description: "High germination carrot seeds for sweet taste and uniform root development.", category: "Seeds", stock: 100 },
  { name: "Beetroot Seeds", price: 145, image: "images/beetroot.png", description: "Quality beetroot seeds for better color, taste and root growth.", category: "Seeds", stock: 100 },
  { name: "Okra (Lady Finger) Seeds", price: 160, image: "images/okra.png", description: "High-yield okra seeds with strong plant growth and tender pods.", category: "Seeds", stock: 100 },
  { name: "Paddy (Rice) Seeds", price: 220, image: "images/paddy.png", description: "High-quality paddy seeds with excellent germination rate and high crop yield.", category: "Seeds", stock: 150 },
  { name: "Maize (Corn) Seeds", price: 210, image: "images/maize.png", description: "Premium maize seeds for strong plant growth and improved grain production.", category: "Seeds", stock: 150 },
  { name: "Barley Seeds", price: 200, image: "images/barley.png", description: "High-yield barley seeds suitable for different soil and climate conditions.", category: "Seeds", stock: 120 },
  { name: "Sorghum (Jowar) Seeds", price: 195, image: "images/sorghum.png", description: "Drought-resistant sorghum seeds for stable production and better crop quality.", category: "Seeds", stock: 120 },
  { name: "Pearl Millet (Bajra) Seeds", price: 190, image: "images/bajra.png", description: "High-performance bajra seeds suitable for dry land farming and high yield.", category: "Seeds", stock: 120 },
  { name: "Ragi Seeds", price: 180, image: "images/ragi.png", description: "Nutritious ragi seeds with strong germination and excellent crop performance.", category: "Seeds", stock: 100 },
  { name: "Green Gram (Moong) Seeds", price: 210, image: "images/moong.png", description: "High-quality moong seeds with excellent germination rate and better crop yield.", category: "Seeds", stock: 100 },
  { name: "Black Gram (Urad) Seeds", price: 205, image: "images/urad.png", description: "Premium urad seeds suitable for strong plant growth and improved productivity.", category: "Seeds", stock: 100 },
  { name: "Chickpea (Chana) Seeds", price: 230, image: "images/chana.png", description: "High-yield chickpea seeds with strong disease resistance and uniform growth.", category: "Seeds", stock: 100 },
  { name: "Pigeon Pea (Toor Dal) Seeds", price: 225, image: "images/toor.png", description: "Quality toor dal seeds for better flowering, pod formation and high yield.", category: "Seeds", stock: 100 },
  { name: "Lentil (Masoor) Seeds", price: 215, image: "images/masoor.png", description: "Premium masoor seeds with excellent germination and uniform crop growth.", category: "Seeds", stock: 100 },
  { name: "Cowpea Seeds", price: 200, image: "images/cowpea.png", description: "High-performance cowpea seeds suitable for multiple soil conditions and climates.", category: "Seeds", stock: 100 },

  // ===== PESTICIDES =====
  { name: "Crop Protection Spray", price: 320, image: "images/spray.png", description: "Protects plants from harmful insects and fungal infections. Safe and effective.", category: "Pesticides", stock: 60 },
  { name: "Insecticide Liquid", price: 400, image: "images/insecticide.png", description: "Powerful insecticide that ensures crop protection against pests and insects.", category: "Pesticides", stock: 45 },
  { name: "Chlorpyrifos 20 EC", price: 380, image: "images/chlorpyrifos.png", description: "Broad-spectrum insecticide used to control termites, borers, and sucking pests in crops.", category: "Pesticides", stock: 40 },
  { name: "Bifenthrin 8 SC", price: 420, image: "images/bifenthrin.png", description: "Effective insecticide for controlling aphids, mites, whiteflies and other crop-damaging insects.", category: "Pesticides", stock: 35 },
  { name: "Imidacloprid 17.8 SL", price: 450, image: "images/imidacloprid.png", description: "Systemic insecticide used to protect crops from sucking insects and termites.", category: "Pesticides", stock: 50 },
  { name: "Cypermethrin 10 EC", price: 410, image: "images/cypermethrin.png", description: "Fast-acting pesticide for controlling insects in cotton, vegetables and cereals.", category: "Pesticides", stock: 50 },
  { name: "Acephate 75 SP", price: 390, image: "images/acephate.png", description: "Water soluble insecticide powder effective against leaf miners and caterpillars.", category: "Pesticides", stock: 50 },
  { name: "Lambda Cyhalothrin 5 EC", price: 430, image: "images/lambda.png", description: "Broad-spectrum insecticide with long-lasting crop protection.", category: "Pesticides", stock: 50 },
  { name: "Thiamethoxam 25 WG", price: 460, image: "images/thiamethoxam.png", description: "Granular insecticide used to control sucking pests in crops.", category: "Pesticides", stock: 50 },
  { name: "Neem Oil Pesticide", price: 350, image: "images/neem.png", description: "Organic neem oil pesticide used for eco-friendly pest control.", category: "Pesticides", stock: 70 },
  { name: "Mancozeb Fungicide", price: 400, image: "images/mancozeb.png", description: "Protective fungicide used to control leaf spots and fungal diseases.", category: "Pesticides", stock: 50 },
  { name: "Carbendazim Fungicide", price: 420, image: "images/carbendazim.png", description: "Systemic fungicide used to prevent fungal infections in crops.", category: "Pesticides", stock: 50 },

  // ===== TOOLS =====
  { name: "Hand Hoe", price: 450, image: "images/handhoe.png", description: "Durable hand hoe used for loosening soil and removing weeds effectively.", category: "Tools", stock: 80 },
  { name: "Garden Trowel", price: 280, image: "images/trowel.png", description: "Strong garden trowel suitable for planting, digging and soil mixing.", category: "Tools", stock: 90 },
  { name: "Hand Weeder", price: 320, image: "images/weeder.png", description: "Efficient hand weeder tool used to remove weeds without damaging crops.", category: "Tools", stock: 75 },
  { name: "Sickle", price: 350, image: "images/sickle.png", description: "Sharp sickle used for harvesting crops and cutting grass easily.", category: "Tools", stock: 70 },
  { name: "Pruning Shears", price: 550, image: "images/pruningshears.png", description: "High-quality pruning shears for cutting branches and trimming plants.", category: "Tools", stock: 60 },
  { name: "Hedge Cutter", price: 780, image: "images/hedgecutter.png", description: "Heavy-duty hedge cutter used for shaping hedges and trimming bushes.", category: "Tools", stock: 40 },
  { name: "Hand Fork", price: 300, image: "images/handfork.png", description: "Strong hand fork tool used for loosening soil and removing debris.", category: "Tools", stock: 80 },
  { name: "Digging Spade", price: 650, image: "images/spade.png", description: "Durable digging spade used for soil digging and land preparation.", category: "Tools", stock: 60 },
  { name: "Garden Rake", price: 480, image: "images/rake.png", description: "Garden rake used for leveling soil and collecting leaves and debris.", category: "Tools", stock: 65 },
  { name: "Khurpi (Traditional Hand Tool)", price: 260, image: "images/khurpi.png", description: "Traditional khurpi tool used for weeding and soil loosening in farms.", category: "Tools", stock: 100 },
  { name: "Manual Sprayer Pump", price: 1200, image: "images/manualsprayer.png", description: "Manual pressure sprayer used for pesticide spraying and plant protection.", category: "Tools", stock: 50 },
  { name: "Battery Sprayer", price: 3800, image: "images/batterysprayer.png", description: "Rechargeable battery sprayer for efficient and effortless crop spraying.", category: "Tools", stock: 30 },
  { name: "Knapsack Sprayer", price: 2200, image: "images/knapsack.png", description: "Backpack sprayer ideal for uniform pesticide application in farms.", category: "Tools", stock: 40 },
  { name: "Foot Sprayer Pump", price: 1800, image: "images/footsprayer.png", description: "Foot operated sprayer pump for continuous spraying without electricity.", category: "Tools", stock: 45 },
  { name: "Drip Irrigation Kit", price: 2500, image: "images/dripkit.png", description: "Water-saving drip irrigation kit for efficient crop watering system.", category: "Tools", stock: 35 },
  { name: "Water Sprinkler Set", price: 1600, image: "images/sprinkler.png", description: "Automatic sprinkler set for uniform water distribution in fields and gardens.", category: "Tools", stock: 40 },
  { name: "Garden Hose Pipe", price: 950, image: "images/hosepipe.png", description: "Flexible hose pipe for irrigation and garden watering purposes.", category: "Tools", stock: 55 },
  { name: "Watering Can", price: 450, image: "images/wateringcan.png", description: "Lightweight watering can for manual watering of plants and seedlings.", category: "Tools", stock: 70 }
];

const seedProducts = async () => {
  try {
    await Product.deleteMany({});
    console.log("Cleared existing products");
    const created = await Product.insertMany(products);
    console.log(`✅ Seeded ${created.length} products successfully`);
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

connectDB().then(seedProducts);
