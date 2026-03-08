// ================== CONFIGURATION ==================
let API_BASE_URL = '/api';

// Load config if available
if (typeof config !== 'undefined' && config.API_BASE_URL) {
  API_BASE_URL = config.API_BASE_URL;
}

// ================== AUTHENTICATION STATE ==================
let currentUser = null;
let authToken = null;
let products = []; // Will be loaded from API

// ================== API FUNCTIONS ==================
async function apiRequest(endpoint, options = {}) {
  const baseUrl = window.API_BASE_URL || API_BASE_URL;
  const url = `${baseUrl}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };

  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
}

async function loadProducts(category = 'all', search = '', sort = '') {
  try {
    let endpoint = '/products';
    const params = new URLSearchParams();

    if (category && category !== 'all') params.append('category', category);
    if (search) params.append('search', search);
    if (sort) params.append('sort', sort);

    if (params.toString()) {
      endpoint += '?' + params.toString();
    }

    const data = await apiRequest(endpoint);

    if (data && data.products) {
      products = data.products;
      renderProducts(products);
      if (data.pagination) {
        updatePagination(data.pagination);
      }
    } else if (Array.isArray(data)) {
      products = data;
      renderProducts(products);
    } else {
      throw new Error("Invalid format received from server");
    }
  } catch (error) {
    console.error('Error loading products from API, falling back to local data:', error);

    // Fallback logic
    let filteredProducts = fallbackProducts.slice();
    if (category && category !== 'all') {
      filteredProducts = filteredProducts.filter(p => p.category === category);
    }
    if (search) {
      const regex = new RegExp(search, 'i');
      filteredProducts = filteredProducts.filter(p => regex.test(p.name) || regex.test(p.desc));
    }
    if (sort === 'price_asc') filteredProducts.sort((a, b) => a.price - b.price);
    else if (sort === 'price_desc') filteredProducts.sort((a, b) => b.price - a.price);
    else if (sort === 'name_asc') filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === 'name_desc') filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
    else filteredProducts.sort((a, b) => a.id - b.id);

    products = filteredProducts;
    renderProducts(products);

    const pagination = {
      currentPage: 1,
      totalPages: 1,
      totalProducts: products.length,
      hasNext: false,
      hasPrev: false
    };
    updatePagination(pagination);
  }
}

function updatePagination(pagination) {
  // Implement pagination UI if needed
  console.log('Pagination:', pagination);
}

// ================== PRODUCT DATA ==================
// Keeping a local copy for fallback, but will be replaced by API data
const fallbackProducts = [
  {
    id: 1,
    name: "Organic Fertilizer",
    price: 250,
    image: "images/organic.png",
    desc: "Eco-friendly fertilizer made from natural compost. Improves soil health and boosts crop yield.",
    category: "Fertilizers"
  },

  {
    id: 2,
    name: "Nitrogen Fertilizer",
    price: 300,
    image: "images/nitrogen.png",
    desc: "High-quality nitrogen-based fertilizer to enhance leaf growth and greener crops.",
    category: "Fertilizers"
  },

  {
    id: 3,
    name: "Hybrid Seeds Pack",
    price: 150,
    image: "images/hybrid.png",
    desc: "High-yielding hybrid seeds that ensure better germination and crop resilience.",
    category: "Seeds"
  },

  {
    id: 4,
    name: "Wheat Seeds",
    price: 180,
    image: "images/wheat.png",
    desc: "Premium quality wheat seeds for higher yield and resistance to pests.",
    category: "Seeds"
  },

  {
    id: 5,
    name: "Crop Protection Spray",
    price: 320, image: "images/spray.png",
    desc: "Protects plants from harmful insects and fungal infections. Safe and effective.",
    category: "Pesticides"
  },

  {
    id: 6,
    name: "Insecticide Liquid",
    price: 400,
    image: "images/insecticide.png",
    desc: "Powerful insecticide that ensures crop protection against pests and insects.",
    category: "Pesticides"
  },

  {
    id: 7,
    name: "Phosphorus Fertilizer",
    price: 600, image: "images/phosphorus.png",
    desc: "Boosts root development and enhances flowering and fruiting in crops.",
    category: "Fertilizers"
  },

  {
    id: 8,
    name: "Potassium Fertilizer",
    price: 700,
    image: "images/potassium.png",
    desc: "Improves drought resistance and strengthens plant immune system.",
    category: "Fertilizers"
  },

  {
    id: 9,
    name: "Chlorpyrifos 20 EC",
    price: 380,
    image: "images/chlorpyrifos.png",
    desc: "Broad-spectrum insecticide used to control termites, borers, and sucking pests in crops.",
    category: "Pesticides"
  },

  {
    id: 10,
    name: "Bifenthrin 8 SC",
    price: 420,
    image: "images/bifenthrin.png",
    desc: "Effective insecticide for controlling aphids, mites, whiteflies and other crop-damaging insects.",
    category: "Pesticides"
  },

  {
    id: 11,
    name: "NPK Fertilizer 10-10-10",
    price: 450,
    image: "images/npk.png",
    desc: "Balanced NPK liquid fertilizer that improves plant growth, root development and crop yield.",
    category: "Fertilizers"
  },

  {
    id: 12,
    name: "DAP Fertilizer 18-46-0",
    price: 1350,
    image: "images/dap.png",
    desc: "High phosphorus fertilizer that promotes strong root growth and early plant development.",
    category: "Fertilizers"
  },

  {
    id: 13,
    name: "Urea Fertilizer 46-0-0",
    price: 1200,
    image: "images/Urea.png",
    desc: "Nitrogen-rich fertilizer that boosts leaf growth and increases crop productivity.",
    category: "Fertilizers"
  },

  {
    id: 14,
    name: "Potash Fertilizer",
    price: 1250,
    image: "images/potash.png",
    desc: "Potassium rich fertilizer that improves crop quality, drought tolerance and disease resistance.",
    category: "Fertilizers"
  },

  {
    id: 15,
    name: "Vermicompost Fertilizer",
    price: 550,
    image: "images/vermicompost.png",
    desc: "Organic fertilizer made from earthworms that improves soil fertility and plant growth naturally.",
    category: "Fertilizers"
  },

  {
    id: 16,
    name: "Bio Fertilizer Bottle",
    price: 350,
    image: "images/biofertilizer.png",
    desc: "Microbial based fertilizer that enhances nutrient absorption and improves soil health.",
    category: "Fertilizers"
  },

  {
    id: 17,
    name: "Liquid Bio Fertilizer",
    price: 420,
    image: "images/liquidbio.png",
    desc: "Liquid bio fertilizer that boosts crop yield and promotes sustainable farming practices.",
    category: "Fertilizers"
  },

  {
    id: 18,
    name: "NPK Fertilizer 10-26-26",
    price: 1250,
    image: "images/npk102626.png",
    desc: "High phosphorus NPK fertilizer that promotes strong root growth and flowering in crops.",
    category: "Fertilizers"
  },

  {
    id: 19,
    name: "NPK Fertilizer 12-32-16",
    price: 1300,
    image: "images/npk123216.png",
    desc: "Balanced fertilizer ideal for early plant growth and improved crop development.",
    category: "Fertilizers"
  },

  {
    id: 20,
    name: "NPK Fertilizer 15-15-15",
    price: 1400,
    image: "images/npk151515.png",
    desc: "All-purpose balanced fertilizer for uniform plant growth and improved yield.",
    category: "Fertilizers"
  },

  {
    id: 21,
    name: "NPK Fertilizer 19-19-19",
    price: 1450,
    image: "images/npk191919.png",
    desc: "Water soluble fertilizer that boosts plant growth and improves crop productivity.",
    category: "Fertilizers"
  },

  {
    id: 22,
    name: "NPK Fertilizer 20-20-20",
    price: 1500,
    image: "images/npk202020.png",
    desc: "Highly effective fertilizer that provides equal nutrients for fast plant growth.",
    category: "Fertilizers"
  },

  {
    id: 23,
    name: "NPK Fertilizer 14-35-14",
    price: 1350,
    image: "images/npk143514.png",
    desc: "Phosphorus rich fertilizer that supports root development and flowering stage.",
    category: "Fertilizers"
  },

  {
    id: 24,
    name: "NPK Fertilizer 28-28-0",
    price: 1550,
    image: "images/npk282800.png",
    desc: "Nitrogen and phosphorus rich fertilizer for rapid vegetative growth and strong crops.",
    category: "Fertilizers"
  },

  {
    id: 25,
    name: "Tomato Hybrid Seeds",
    price: 180,
    image: "images/tomato.png",
    desc: "High-yield hybrid tomato seeds with excellent germination and disease resistance.",
    category: "Seeds"
  },

  {
    id: 26,
    name: "Onion Seeds",
    price: 160,
    image: "images/onion.png",
    desc: "Premium quality onion seeds for uniform bulb size and higher yield.",
    category: "Seeds"
  },

  {
    id: 27,
    name: "Chilli Seeds",
    price: 170,
    image: "images/chilli.png",
    desc: "High-quality chilli seeds for spicy, healthy and high-yield crops.",
    category: "Seeds"
  },

  {
    id: 28,
    name: "Brinjal (Eggplant) Seeds",
    price: 165,
    image: "images/brinjal.png",
    desc: "Premium brinjal seeds with strong plant growth and improved fruit quality.",
    category: "Seeds"
  },

  {
    id: 29,
    name: "Cabbage Seeds",
    price: 150,
    image: "images/cabbage.png",
    desc: "High-quality cabbage seeds for uniform head formation and better yield.",
    category: "Seeds"
  },

  {
    id: 30,
    name: "Cauliflower Seeds",
    price: 155,
    image: "images/cauliflower.png",
    desc: "Premium cauliflower seeds with excellent curd quality and disease resistance.",
    category: "Seeds"
  },

  {
    id: 31,
    name: "Carrot Seeds",
    price: 140,
    image: "images/carrot.png",
    desc: "High germination carrot seeds for sweet taste and uniform root development.",
    category: "Seeds"
  },

  {
    id: 32,
    name: "Beetroot Seeds",
    price: 145,
    image: "images/beetroot.png",
    desc: "Quality beetroot seeds for better color, taste and root growth.",
    category: "Seeds"
  },

  {
    id: 33,
    name: "Okra (Lady Finger) Seeds",
    price: 160,
    image: "images/okra.png",
    desc: "High-yield okra seeds with strong plant growth and tender pods.",
    category: "Seeds"
  },

  {
    id: 34,
    name: "Paddy (Rice) Seeds",
    price: 220,
    image: "images/paddy.png",
    desc: "High-quality paddy seeds with excellent germination rate and high crop yield.",
    category: "Seeds"
  },

  {
    id: 35,
    name: "Maize (Corn) Seeds",
    price: 210,
    image: "images/maize.png",
    desc: "Premium maize seeds for strong plant growth and improved grain production.",
    category: "Seeds"
  },

  {
    id: 36,
    name: "Barley Seeds",
    price: 200,
    image: "images/barley.png",
    desc: "High-yield barley seeds suitable for different soil and climate conditions.",
    category: "Seeds"
  },

  {
    id: 37,
    name: "Sorghum (Jowar) Seeds",
    price: 195,
    image: "images/sorghum.png",
    desc: "Drought-resistant sorghum seeds for stable production and better crop quality.",
    category: "Seeds"
  },

  {
    id: 38,
    name: "Pearl Millet (Bajra) Seeds",
    price: 190,
    image: "images/bajra.png",
    desc: "High-performance bajra seeds suitable for dry land farming and high yield.",
    category: "Seeds"
  },

  {
    id: 39,
    name: "Ragi Seeds",
    price: 180,
    image: "images/ragi.png",
    desc: "Nutritious ragi seeds with strong germination and excellent crop performance.",
    category: "Seeds"
  },

  {
    id: 40,
    name: "Green Gram (Moong) Seeds",
    price: 210,
    image: "images/moong.png",
    desc: "High-quality moong seeds with excellent germination rate and better crop yield.",
    category: "Seeds"
  },

  {
    id: 41,
    name: "Black Gram (Urad) Seeds",
    price: 205,
    image: "images/urad.png",
    desc: "Premium urad seeds suitable for strong plant growth and improved productivity.",
    category: "Seeds"
  },

  {
    id: 42,
    name: "Chickpea (Chana) Seeds",
    price: 230,
    image: "images/chana.png",
    desc: "High-yield chickpea seeds with strong disease resistance and uniform growth.",
    category: "Seeds"
  },

  {
    id: 43,
    name: "Pigeon Pea (Toor Dal) Seeds",
    price: 225,
    image: "images/toor.png",
    desc: "Quality toor dal seeds for better flowering, pod formation and high yield.",
    category: "Seeds"
  },

  {
    id: 44,
    name: "Lentil (Masoor) Seeds",
    price: 215,
    image: "images/masoor.png",
    desc: "Premium masoor seeds with excellent germination and uniform crop growth.",
    category: "Seeds"
  },

  {
    id: 45,
    name: "Cowpea Seeds",
    price: 200,
    image: "images/cowpea.png",
    desc: "High-performance cowpea seeds suitable for multiple soil conditions and climates.",
    category: "Seeds"
  },

  {
    id: 46,
    name: "Chlorpyrifos 20 EC",
    price: 380,
    image: "images/chlorpyrifos.png",
    desc: "Broad-spectrum insecticide used to control termites, borers and sucking pests.",
    category: "Pesticides"
  },

  {
    id: 47,
    name: "Bifenthrin 8 SC",
    price: 420,
    image: "images/bifenthrin.png",
    desc: "Effective insecticide for controlling aphids, mites, whiteflies and crop pests.",
    category: "Pesticides"
  },

  {
    id: 48,
    name: "Imidacloprid 17.8 SL",
    price: 450,
    image: "images/imidacloprid.png",
    desc: "Systemic insecticide used to protect crops from sucking insects and termites.",
    category: "Pesticides"
  },

  {
    id: 49,
    name: "Cypermethrin 10 EC",
    price: 410,
    image: "images/cypermethrin.png",
    desc: "Fast-acting pesticide for controlling insects in cotton, vegetables and cereals.",
    category: "Pesticides"
  },

  {
    id: 50,
    name: "Acephate 75 SP",
    price: 390,
    image: "images/acephate.png",
    desc: "Water soluble insecticide powder effective against leaf miners and caterpillars.",
    category: "Pesticides"
  },

  {
    id: 51,
    name: "Lambda Cyhalothrin 5 EC",
    price: 430,
    image: "images/lambda.png",
    desc: "Broad-spectrum insecticide with long-lasting crop protection.",
    category: "Pesticides"
  },

  {
    id: 52,
    name: "Thiamethoxam 25 WG",
    price: 460,
    image: "images/thiamethoxam.png",
    desc: "Granular insecticide used to control sucking pests in crops.",
    category: "Pesticides"
  },

  {
    id: 53,
    name: "Neem Oil Pesticide",
    price: 350,
    image: "images/neem.png",
    desc: "Organic neem oil pesticide used for eco-friendly pest control.",
    category: "Pesticides"
  },

  {
    id: 54,
    name: "Mancozeb Fungicide",
    price: 400,
    image: "images/mancozeb.png",
    desc: "Protective fungicide used to control leaf spots and fungal diseases.",
    category: "Pesticides"
  },

  {
    id: 55,
    name: "Carbendazim Fungicide",
    price: 420,
    image: "images/carbendazim.png",
    desc: "Systemic fungicide used to prevent fungal infections in crops.",
    category: "Pesticides"
  },

  {
    id: 56,
    name: "Hand Hoe",
    price: 450,
    image: "images/handhoe.png",
    desc: "Durable hand hoe used for loosening soil and removing weeds effectively.",
    category: "Tools"
  },

  {
    id: 57,
    name: "Garden Trowel",
    price: 280,
    image: "images/trowel.png",
    desc: "Strong garden trowel suitable for planting, digging and soil mixing.",
    category: "Tools"
  },

  {
    id: 58,
    name: "Hand Weeder",
    price: 320,
    image: "images/weeder.png",
    desc: "Efficient hand weeder tool used to remove weeds without damaging crops.",
    category: "Tools"
  },

  {
    id: 59,
    name: "Sickle",
    price: 350,
    image: "images/sickle.png",
    desc: "Sharp sickle used for harvesting crops and cutting grass easily.",
    category: "Tools"
  },

  {
    id: 60,
    name: "Pruning Shears",
    price: 550,
    image: "images/pruningshears.png",
    desc: "High-quality pruning shears for cutting branches and trimming plants.",
    category: "Tools"
  },

  {
    id: 61,
    name: "Hedge Cutter",
    price: 780,
    image: "images/hedgecutter.png",
    desc: "Heavy-duty hedge cutter used for shaping hedges and trimming bushes.",
    category: "Tools"
  },

  {
    id: 62,
    name: "Hand Fork",
    price: 300,
    image: "images/handfork.png",
    desc: "Strong hand fork tool used for loosening soil and removing debris.",
    category: "Tools"
  },

  {
    id: 63,
    name: "Digging Spade",
    price: 650,
    image: "images/spade.png",
    desc: "Durable digging spade used for soil digging and land preparation.",
    category: "Tools"
  },

  {
    id: 64,
    name: "Garden Rake",
    price: 480,
    image: "images/rake.png",
    desc: "Garden rake used for leveling soil and collecting leaves and debris.",
    category: "Tools"
  },

  {
    id: 65,
    name: "Khurpi (Traditional Hand Tool)",
    price: 260,
    image: "images/khurpi.png",
    desc: "Traditional khurpi tool used for weeding and soil loosening in farms.",
    category: "Tools"
  },

  {
    id: 66,
    name: "Manual Sprayer Pump",
    price: 1200,
    image: "images/manualsprayer.png",
    desc: "Manual pressure sprayer used for pesticide spraying and plant protection.",
    category: "Tools"
  },

  {
    id: 67,
    name: "Battery Sprayer",
    price: 3800,
    image: "images/batterysprayer.png",
    desc: "Rechargeable battery sprayer for efficient and effortless crop spraying.",
    category: "Tools"
  },

  {
    id: 68,
    name: "Knapsack Sprayer",
    price: 2200,
    image: "images/knapsack.png",
    desc: "Backpack sprayer ideal for uniform pesticide application in farms.",
    category: "Tools"
  },

  {
    id: 69,
    name: "Foot Sprayer Pump",
    price: 1800,
    image: "images/footsprayer.png",
    desc: "Foot operated sprayer pump for continuous spraying without electricity.",
    category: "Tools"
  },

  {
    id: 70,
    name: "Drip Irrigation Kit",
    price: 2500,
    image: "images/dripkit.png",
    desc: "Water-saving drip irrigation kit for efficient crop watering system.",
    category: "Tools"
  },

  {
    id: 71,
    name: "Water Sprinkler Set",
    price: 1600,
    image: "images/sprinkler.png",
    desc: "Automatic sprinkler set for uniform water distribution in fields and gardens.",
    category: "Tools"
  },

  {
    id: 72,
    name: "Garden Hose Pipe",
    price: 950,
    image: "images/hosepipe.png",
    desc: "Flexible hose pipe for irrigation and garden watering purposes.",
    category: "Tools"
  },

  {
    id: 73,
    name: "Watering Can",
    price: 450,
    image: "images/wateringcan.png",
    desc: "Lightweight watering can for manual watering of plants and seedlings.",
    category: "Tools"
  }







];

// ================== LOGIN / SIGNUP / RESET ==================

// Fallback API endpoints if config.js doesn't load
const API_ENDPOINTS = window.API_ENDPOINTS || {
  auth: {
    login: '/api/auth/login',
    signup: '/api/auth/signup',
    reset: '/api/auth/reset'
  }
};

// LOGIN
async function loginUser(email, password) {
  try {
    if (!email || !password) {
      alert("⚠️ Please enter both email and password.");
      return;
    }

    const data = await apiRequest('/auth/login', {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    // Store authentication data
    authToken = data.token;
    currentUser = data.user;
    localStorage.setItem('authToken', authToken);
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    localStorage.setItem("isLoggedIn", "true");

    updateNavbar();
    window.location.href = "index.html";
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// SIGNUP
async function signupUser(userData) {
  try {
    // Validate required fields
    if (!userData.firstName || !userData.lastName || !userData.mobileNumber || !userData.email || !userData.password) {
      throw new Error("All required fields must be filled.");
    }

    await apiRequest('/auth/signup', {
      method: "POST",
      body: JSON.stringify(userData),
    });

    window.location.href = "login.html";
  } catch (err) {
    console.error("Signup error:", err);
    throw err;
  }
}

// ================== GOOGLE SIGN-IN ==================
async function signInWithGoogle() {
  try {
    if (!window.firebaseAuth) {
      alert("Google Sign-In not available. Please try email login.");
      return;
    }
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('email');
    provider.addScope('profile');

    const result = await window.firebaseAuth.signInWithPopup(provider);
    const user = result.user;

    // Send to backend to create/login user
    const response = await apiRequest('/auth/google-login', {
      method: "POST",
      body: JSON.stringify({
        googleUID: user.uid,
        email: user.email,
        firstName: user.displayName ? user.displayName.split(' ')[0] : 'User',
        lastName: user.displayName ? user.displayName.split(' ').slice(1).join(' ') : '',
        photoURL: user.photoURL
      }),
    });

    authToken = response.token;
    currentUser = response.user;
    localStorage.setItem('authToken', authToken);
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    localStorage.setItem("isLoggedIn", "true");

    updateNavbar();
    window.location.href = "index.html";
  } catch (error) {
    console.error("Google Sign-In error:", error);
    if (error.code === 'auth/popup-closed-by-user') return;
    alert("Google Sign-In failed: " + error.message);
  }
}

// LOGOUT
function logoutUser() {
  if (!confirm("Are you sure you want to logout?")) return;

  // Clear authentication data
  authToken = null;
  currentUser = null;
  localStorage.removeItem('authToken');
  localStorage.removeItem('currentUser');
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("cart");
  updateNavbar();
  window.location.href = "login.html";
}

// RESET PASSWORD
async function resetPassword(email, newPassword) {
  try {
    if (!email || !newPassword) {
      alert("⚠️ Please enter all required fields.");
      return;
    }

    const res = await fetch(API_ENDPOINTS.auth.reset, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, newPassword }),
    });

    const data = await res.json();
    if (res.ok) {
      window.location.href = "login.html";
    } else {
      alert("❌ " + (data.message || "Reset failed."));
    }
  } catch (err) {
    console.error(err);
    alert("⚠️ Error resetting password.");
  }
}

// ================== CART SYSTEM ==================
function addToCart(productId) {
  if (!isUserLoggedIn()) {
    alert("⚠️ Please login before adding products to the cart.");
    window.location.href = "login.html";
    return;
  }

  let cart = safeGetCart();
  const product = products.find(p => String(p._id || p.id) === String(productId));

  if (!product) {
    alert("Product not found!");
    return;
  }

  const existing = cart.find(item => (item._id || item.id) === productId);
  if (existing) {
    existing.quantity += 1;
    if (confirm(`🛒 Increased quantity of ${product.name}. View cart?`)) {
      window.location.href = "cart.html";
    }
  } else {
    cart.push({ ...product, quantity: 1 });
    if (confirm(`🛒 ${product.name} added to your cart. View cart?`)) {
      window.location.href = "cart.html";
    }
  }

  localStorage.setItem("cart", JSON.stringify(cart));
}

function safeGetCart() {
  try {
    return JSON.parse(localStorage.getItem("cart")) || [];
  } catch {
    return [];
  }
}

function getCart() {
  return safeGetCart();
}

// Render cart on cart.html
function renderCart() {
  const cartItemsContainer = document.getElementById("cart-items");
  const checkoutBtn = document.getElementById("checkout-btn");
  const cart = getCart();

  if (!cartItemsContainer) return;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
    document.getElementById("cart-total").innerText = "";
    if (checkoutBtn) checkoutBtn.style.display = "none";
    return;
  }

  let total = 0;
  cartItemsContainer.innerHTML = cart
    .map(
      (item, index) => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}" class="cart-img">
        <div>
          <h3>${item.name}</h3>
          <p>${item.desc}</p>
          <p>Price: ₹${item.price}</p>
          <div class="quantity-controls">
            <button onclick="decrementQuantity(${index})" class="qty-btn">−</button>
            <span class="quantity">${item.quantity}</span>
            <button onclick="incrementQuantity(${index})" class="qty-btn">+</button>
          </div>
          <p>Subtotal: ₹${item.price * item.quantity}</p>
          <button onclick="removeFromCart(${index})" class="remove-btn">❌ Remove</button>
        </div>
      </div>
    `
    )
    .join("");

  total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  document.getElementById("cart-total").innerText = "Total: ₹" + total;

  if (checkoutBtn) {
    checkoutBtn.style.display = "inline-block";
    checkoutBtn.onclick = proceedToCheckout;
  }
}

// Remove item from cart
function removeFromCart(index) {
  let cart = getCart();
  if (cart[index]) {
    if (confirm(`Remove ${cart[index].name} from cart?`)) {
      cart.splice(index, 1);
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
    }
  }
}

// Increment quantity of cart item
function incrementQuantity(index) {
  let cart = getCart();
  if (cart[index]) {
    cart[index].quantity += 1;
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
  }
}

// Decrement quantity of cart item
function decrementQuantity(index) {
  let cart = getCart();
  if (cart[index]) {
    if (cart[index].quantity > 1) {
      cart[index].quantity -= 1;
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
    } else {
      // If quantity becomes 0, ask to remove the item
      if (confirm(`Remove ${cart[index].name} from cart?`)) {
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
      }
    }
  }
}

// Proceed to checkout
function proceedToCheckout() {
  if (!isUserLoggedIn()) {
    alert("⚠️ Please login before proceeding to checkout.");
    window.location.href = "login.html";
    return;
  }

  const cart = getCart();
  if (cart.length === 0) {
    alert("⚠️ Your cart is empty.");
    return;
  }

  window.location.href = "checkout.html";
}

// ================== UTILITIES ==================
function isUserLoggedIn() {
  return !!(currentUser && authToken);
}

function updateNavbar() {
  const loggedIn = !!(currentUser && authToken);
  const isAdmin = loggedIn && currentUser.role === 'admin';

  // Desktop nav
  const loginLink = document.getElementById('login-link');
  const logoutLink = document.getElementById('logout-link');
  const ordersLink = document.getElementById('orders-link');
  const adminLink = document.getElementById('admin-link');
  if (loginLink) loginLink.style.display = loggedIn ? 'none' : 'inline';
  if (logoutLink) { logoutLink.style.display = loggedIn ? 'inline' : 'none'; logoutLink.onclick = logoutUser; }
  if (ordersLink) ordersLink.style.display = loggedIn ? 'inline' : 'none';
  if (adminLink) adminLink.style.display = isAdmin ? 'inline' : 'none';

  // Mobile nav drawer links (prefixed with m-)
  const mLoginLink = document.getElementById('m-login-link');
  const mLogoutLink = document.getElementById('m-logout-link');
  const mOrdersLink = document.getElementById('m-orders-link');
  const mAdminLink = document.getElementById('m-admin-link');
  if (mLoginLink) mLoginLink.style.display = loggedIn ? 'none' : 'block';
  if (mLogoutLink) mLogoutLink.style.display = loggedIn ? 'block' : 'none';
  if (mOrdersLink) mOrdersLink.style.display = loggedIn ? 'block' : 'none';
  if (mAdminLink) mAdminLink.style.display = isAdmin ? 'block' : 'none';
}

// ================== PRODUCT RENDERING ==================
let currentCategory = 'all';
let currentSearch = '';

function filterProducts(category) {
  currentCategory = category;
  loadProducts(currentCategory, currentSearch);
}

function renderProducts(productList = products) {
  const grid = document.getElementById("product-grid");
  if (!grid) return;

  grid.innerHTML = "";

  if (productList.length === 0) {
    const searchTerm = currentSearch ? `"${currentSearch}"` : '';
    grid.innerHTML = `
      <div class="no-results">
        <span class="no-results-icon">🌾</span>
        <h3>No products found${searchTerm ? ' for ' + searchTerm : ''}</h3>
        <p>${searchTerm ? 'Try a different keyword or clear the search.' : 'No products available in this category.'}</p>
      </div>`;
    return;
  }

  productList.forEach(p => {
    const card = document.createElement("div");
    card.classList.add("product-card");

    const productId = p._id || p.id;
    const productDesc = p.description || p.desc || '';
    const stock = p.stock ?? 999;
    const outOfStock = stock === 0;
    const lowStock = stock > 0 && stock <= 10;
    const stockBadgeClass = outOfStock ? 'out-stock' : lowStock ? 'low-stock' : 'in-stock';
    const stockBadgeText = outOfStock ? 'Out of Stock' : lowStock ? `Only ${stock} left` : 'In Stock';

    card.innerHTML = `
      <div class="product-card-img-wrap">
        <img src="${p.image}" alt="${p.name}" onerror="this.src='images/placeholder.png'" />
        <span class="stock-badge ${stockBadgeClass}">${stockBadgeText}</span>
      </div>
      <div class="product-card-body">
        <span class="product-cat-tag">${p.category || ''}</span>
        <h3>${p.name}</h3>
        <p class="product-desc">${productDesc}</p>
        <div class="product-price-row">
          <span class="product-price">₹${Number(p.price).toLocaleString('en-IN')}</span>
          <span class="product-price-unit">/ unit</span>
        </div>
      </div>
      <div class="product-card-actions">
        <button class="btn-add-cart" onclick="event.stopPropagation();addToCart('${productId}')" ${outOfStock ? 'disabled' : ''}>
          ${outOfStock ? 'Out of Stock' : '+ Add to Cart'}
        </button>
        <button class="btn-view-details" onclick="event.stopPropagation();window.location.href='product-detail.html?id=${productId}'">Details</button>
      </div>
    `;

    card.addEventListener('click', () => {
      window.location.href = `product-detail.html?id=${productId}`;
    });

    grid.appendChild(card);
  });
}

// ================== FORM HANDLING ==================
document.addEventListener("DOMContentLoaded", function () {
  // Load authentication state from localStorage
  authToken = localStorage.getItem('authToken');
  const userData = localStorage.getItem('currentUser');
  if (userData) {
    currentUser = JSON.parse(userData);
  }


  // Google Sign-In button
  const googleBtn = document.getElementById("googleSignInBtn");
  if (googleBtn) {
    googleBtn.addEventListener("click", signInWithGoogle);
  }





  // ================== CHECKOUT FORM HANDLING ==================
  if (document.getElementById("checkoutForm")) {
    const cart = getCart();
    const orderItems = document.getElementById("orderItems");
    const orderTotal = document.getElementById("orderTotal");

    if (cart.length === 0) {
      alert("⚠️ Your cart is empty. Redirecting to products...");
      window.location.href = "index.html";
    } else {
      let total = 0;
      cart.forEach(item => {
        const li = document.createElement("li");
        li.textContent = `${item.name} - ₹${item.price} x ${item.quantity}`;
        if (orderItems) orderItems.appendChild(li);
        total += item.price * item.quantity;
      });
      if (orderTotal) orderTotal.textContent = total;
    }

    document.getElementById("checkoutForm").addEventListener("submit", async (e) => {
      e.preventDefault();

      if (!addressData || !addressData.fullName) {
        alert("⚠️ Please complete the delivery address step first.");
        return;
      }

      const payment = document.getElementById("payment").value;

      // Prepare order data for API
      const items = cart.map(item => ({
        productId: item._id || item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      }));

      const orderData = {
        items,
        totalAmount: Number(orderTotal.textContent),
        shippingAddress: addressData,
        paymentMethod: payment === "Cash on Delivery" ? "COD" : payment
      };

      try {
        const response = await apiRequest('/orders/place', {
          method: 'POST',
          body: JSON.stringify(orderData)
        });

        // Clear cart
        localStorage.removeItem("cart");

        // Redirect to order confirmation with order ID
        window.location.href = `order-confirmation.html?orderId=${response.orderId}`;

      } catch (error) {
        console.error('Error placing order:', error);
        alert('❌ Error placing order: ' + error.message);
      }
    });
  }

  // ================== ORDER CONFIRMATION PAGE ==================
  if (document.getElementById("order-details")) {
    // Get order ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('orderId');

    const details = document.getElementById("order-details");

    if (orderId && isUserLoggedIn()) {
      // Fetch order details from API
      apiRequest(`/orders/${orderId}`)
        .then(order => {
          const addr = order.shippingAddress;
          const addressStr = `${addr.doorNumber}, ${addr.area}${addr.landmark ? ', ' + addr.landmark : ''}, ${addr.district}, ${addr.state}, ${addr.country} - ${addr.pincode}`;
          details.innerHTML = `
            <h3>Order Details</h3>
            <p><strong>Order ID:</strong> ${order._id.slice(-8)}</p>
            <p><strong>Status:</strong> <span class="status-${order.status.toLowerCase()}">${order.status}</span></p>
            <p><strong>Customer:</strong> ${addr.fullName}</p>
            <p><strong>Address:</strong> ${addressStr}</p>
            <p><strong>Phone:</strong> ${addr.phone}</p>
            <p><strong>Payment:</strong> ${order.paymentMethod}</p>

            <h3>Order Items</h3>
            <ul>
              ${order.items.map(item => `<li>${item.name} - ₹${item.price} x ${item.quantity} = ₹${item.price * item.quantity}</li>`).join("")}
            </ul>
            <p><strong>Total Amount:</strong> ₹${order.totalAmount}</p>
          `;
        })
        .catch(error => {
          console.error('Error fetching order:', error);
          details.innerHTML = `<p>Error loading order details. Please check your order history.</p>`;
        });
    } else {
      details.innerHTML = `<p>Order details not available. Please check your order history.</p>`;
    }
  }

  // ================== SEARCH BAR ==================
  const searchInput = document.getElementById('search-input');
  const clearSearchBtn = document.getElementById('clear-search-btn');

  if (searchInput) {
    let debounceTimer;

    searchInput.addEventListener('input', function () {
      currentSearch = this.value.trim();

      // Show/hide the clear button
      clearSearchBtn.style.display = currentSearch ? 'flex' : 'none';

      // Debounce: wait 400ms after the user stops typing
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        loadProducts(currentCategory, currentSearch);
        if (currentSearch) {
          const productsSection = document.querySelector('.products');
          if (productsSection) {
            window.scrollTo({ top: productsSection.offsetTop - 80, behavior: 'smooth' });
          }
        }
      }, 400);
    });

    clearSearchBtn.addEventListener('click', function () {
      searchInput.value = '';
      currentSearch = '';
      clearSearchBtn.style.display = 'none';
      searchInput.focus();
      loadProducts(currentCategory, '');
    });
  }

  // ================== CATEGORY FILTERING ==================
  const categoryButtons = document.querySelectorAll('.category-btn');
  categoryButtons.forEach(button => {
    button.addEventListener('click', function () {
      // Remove active class from all buttons
      categoryButtons.forEach(btn => btn.classList.remove('active'));
      // Add active class to clicked button
      this.classList.add('active');

      const category = this.getAttribute('data-category');
      filterProducts(category);
    });
  });

  // ================== INITIALIZE ==================
  console.log("Script loaded successfully");
  console.log("API_ENDPOINTS:", API_ENDPOINTS);

  loadProducts('all'); // Load all products initially
  renderCart();
  updateNavbar();
});
