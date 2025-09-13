// ================== PRODUCT DATA ==================
const products = [
  { id: 1, name: "Organic Fertilizer", price: 250, image: "images/organic.png", desc: "Eco-friendly fertilizer made from natural compost. Improves soil health and boosts crop yield." },
  { id: 2, name: "Nitrogen Fertilizer", price: 300, image: "images/nitrogen.png", desc: "High-quality nitrogen-based fertilizer to enhance leaf growth and greener crops." },
  { id: 3, name: "Hybrid Seeds Pack", price: 150, image: "images/hybrid.png", desc: "High-yielding hybrid seeds that ensure better germination and crop resilience." },
  { id: 4, name: "Wheat Seeds", price: 180, image: "images/wheat.png", desc: "Premium quality wheat seeds for higher yield and resistance to pests." },
  { id: 5, name: "Crop Protection Spray", price: 320, image: "images/spray.png", desc: "Protects plants from harmful insects and fungal infections. Safe and effective." },
  { id: 6, name: "Insecticide Liquid", price: 400, image: "images/insecticide.png", desc: "Powerful insecticide that ensures crop protection against pests and insects." },
  { id: 7, name: "Phosphorus Fertilizer", price: 600, image: "images/phosphorus.png", desc: "Boosts root development and enhances flowering and fruiting in crops." },
  { id: 8, name: "Potassium Fertilizer", price: 700, image: "images/potassium.png", desc: "Improves drought resistance and strengthens plant immune system." }
];

// ================== LOGIN / SIGNUP / RESET ==================

// LOGIN
async function loginUser(email, password) {
  try {
    if (!email || !password) {
      alert("⚠️ Please enter both email and password.");
      return;
    }

    const res = await fetch(API_ENDPOINTS.auth.login, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userEmail", data.email);
      updateNavbar();
      alert("✅ Login successful!");
      window.location.href = "home.html";
    } else {
      alert("❌ " + (data.message || "Login failed."));
    }
  } catch (err) {
    console.error(err);
    alert("⚠️ Network error. Please try again.");
  }
}

// SIGNUP
async function signupUser(firstName, lastName, email, password) {
  try {
    if (!firstName || !lastName || !email || !password) {
      alert("⚠️ All fields are required for signup.");
      return;
    }

    const res = await fetch(API_ENDPOINTS.auth.signup, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("✅ Signup successful! Please login.");
      window.location.href = "login.html";
    } else {
      alert("❌ " + (data.message || "Signup failed."));
    }
  } catch (err) {
    console.error(err);
    alert("⚠️ Error signing up. Please try again.");
  }
}

// LOGOUT
function logoutUser() {
  if (!confirm("Are you sure you want to logout?")) return;

  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("cart");
  updateNavbar();
  alert("✅ Logged out successfully.");
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
      alert("✅ Password reset successful. Please login.");
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
  const product = products.find(p => p.id === productId);

  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.quantity += 1;
    alert(`🛒 Increased quantity of ${product.name}.`);
  } else {
    cart.push({ ...product, quantity: 1 });
    alert(`🛒 ${product.name} added to your cart.`);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  window.location.href = "cart.html";
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
          <p>Quantity: ${item.quantity}</p>
          <button onclick="removeFromCart(${index})">❌ Remove</button>
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

  alert("✅ Proceeding to checkout...");
  window.location.href = "checkout.html";
}

// ================== UTILITIES ==================
function isUserLoggedIn() {
  return localStorage.getItem("isLoggedIn") === "true";
}

function updateNavbar() {
  const loginLink = document.getElementById("login-link");
  const logoutLink = document.getElementById("logout-link");

  if (!loginLink || !logoutLink) return;

  if (isUserLoggedIn()) {
    loginLink.style.display = "none";
    logoutLink.style.display = "inline";
    logoutLink.onclick = logoutUser;
  } else {
    loginLink.style.display = "inline";
    logoutLink.style.display = "none";
  }
}

// ================== PRODUCT RENDERING ==================
function renderProducts(productList = products) {
  const grid = document.getElementById("product-grid");
  if (!grid) return;

  grid.innerHTML = "";

  if (productList.length === 0) {
    grid.innerHTML = "<p>No products found.</p>";
    return;
  }

  productList.forEach(p => {
    const card = document.createElement("div");
    card.classList.add("product-card");

    card.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p class="desc">${p.desc}</p>
      <p class="price">₹${p.price}</p>
      <button onclick="addToCart(${p.id})">Add to Cart</button>
    `;

    grid.appendChild(card);
  });
}

// ================== SEARCH SYSTEM ==================
function setupSearch() {
  const searchInput = document.getElementById("search-input");
  const searchButton = document.getElementById("search-button");
  const suggestionBox = document.getElementById("suggestions");

  if (!searchInput) return;

  function filterProducts(query) {
    const results = products.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.desc.toLowerCase().includes(query)
    );
    renderProducts(results);
  }

  // Suggestions on typing
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase().trim();
    suggestionBox.innerHTML = "";

    if (!query) {
      renderProducts(products);
      return;
    }

    const matches = products.filter(p =>
      p.name.toLowerCase().includes(query)
    );

    if (matches.length === 0) {
      suggestionBox.innerHTML = "<div class='suggestion-item'>No results found</div>";
      return;
    }

    matches.forEach(item => {
      const div = document.createElement("div");
      div.classList.add("suggestion-item");
      div.textContent = item.name;
      div.onclick = () => {
        searchInput.value = item.name;
        filterProducts(item.name.toLowerCase());
        suggestionBox.innerHTML = "";
      };
      suggestionBox.appendChild(div);
    });

    filterProducts(query);
  });

  // Search button click
  if (searchButton) {
    searchButton.addEventListener("click", () => {
      filterProducts(searchInput.value.toLowerCase().trim());
      suggestionBox.innerHTML = "";
    });
  }
}

// ================== FORM HANDLING ==================
document.addEventListener("DOMContentLoaded", function () {
  // Login form
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const email = document.getElementById("loginEmail").value;
      const password = document.getElementById("loginPassword").value;
      loginUser(email, password);
    });
  }

  // Signup form
  const signupForm = document.getElementById("signupForm");
  if (signupForm) {
    signupForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const firstName = document.getElementById("first_name").value.trim();
      const lastName = document.getElementById("last_name").value.trim();
      const email = document.getElementById("signup_email").value.trim();
      const password = document.getElementById("signup_password").value.trim();
      signupUser(firstName, lastName, email, password);
    });
  }

  // Reset password form
  const resetForm = document.getElementById("resetForm");
  if (resetForm) {
    resetForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const email = document.getElementById("resetEmail").value.trim();
      const newPassword = document.getElementById("newPassword").value.trim();
      const confirmPassword = document.getElementById("confirmPassword").value.trim();

      if (!email || !newPassword || !confirmPassword) {
        alert("⚠️ Please fill in all fields.");
        return;
      }

      if (newPassword !== confirmPassword) {
        alert("❌ Passwords do not match!");
        return;
      }

      resetPassword(email, newPassword);
    });
  }

  // ================== CHECKOUT FORM HANDLING ==================
  if (document.getElementById("checkoutForm")) {
    const cart = getCart();
    const orderItems = document.getElementById("orderItems");
    const orderTotal = document.getElementById("orderTotal");

    if (cart.length === 0) {
      alert("⚠️ Your cart is empty. Redirecting to products...");
      window.location.href = "home.html";
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

    document.getElementById("checkoutForm").addEventListener("submit", (e) => {
      e.preventDefault();

      const phone = document.getElementById("phone").value.trim();
      if (phone.length < 10) {
        alert("⚠️ Please enter a valid phone number.");
        return;
      }

      const order = {
        fullName: document.getElementById("fullName").value.trim(),
        address: document.getElementById("address").value.trim(),
        phone: phone,
        payment: document.getElementById("payment").value,
        items: cart,
        total: Number(orderTotal.textContent)
      };

      // Save order in localStorage
      localStorage.setItem("lastOrder", JSON.stringify(order));
      localStorage.removeItem("cart");

      // Show popup then redirect
      alert("✅ Order placed successfully!");
      window.location.href = "order-confirmation.html"; // make sure this file exists
    });
  }

  // ================== ORDER CONFIRMATION PAGE ==================
  if (document.getElementById("order-details")) {
    const order = JSON.parse(localStorage.getItem("lastOrder"));
    const details = document.getElementById("order-details");

    if (order) {
      details.innerHTML = `
        <h3>Customer Details</h3>
        <p><strong>Name:</strong> ${order.fullName}</p>
        <p><strong>Address:</strong> ${order.address}</p>
        <p><strong>Phone:</strong> ${order.phone}</p>
        <p><strong>Payment:</strong> ${order.payment}</p>

        <h3>Order Items</h3>
        <ul>
          ${order.items.map(item => `<li>${item.name} - ₹${item.price} x ${item.quantity}</li>`).join("")}
        </ul>
        <p><strong>Total Paid:</strong> ₹${order.total}</p>
      `;
    } else {
      details.innerHTML = `<p>No order found.</p>`;
    }
  }

  // ================== INITIALIZE ==================
  renderProducts();
  renderCart();
  updateNavbar();
  setupSearch();
});
