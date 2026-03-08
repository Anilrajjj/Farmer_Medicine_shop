/**
 * product-detail.js
 * Handles loading and rendering of the individual product detail page.
 * Reads product ID from the URL query string: ?id=<productId>
 * Depends on: script.js (for addToCart, apiRequest, window.API_BASE_URL)
 */

(function () {
    'use strict';

    // ---- Read ID from URL ----
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');

    // ---- Helpers ----
    function showToast(message, color = '#2e7d32') {
        const toast = document.getElementById('toast');
        if (!toast) return;
        toast.textContent = message;
        toast.style.background = color;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }

    function getQuantity() {
        const input = document.getElementById('qty-input');
        return input ? parseInt(input.value) || 1 : 1;
    }

    // ---- Render full product detail ----
    function renderDetail(product) {
        const productId = product._id || product.id;
        const productDesc = product.description || product.desc || 'No description available.';
        const stockCount = product.stock !== undefined ? product.stock : null;
        const inStock = stockCount === null || stockCount > 0;
        const originalPrice = Math.round(product.price * 1.15); // show ~15% fake MRP
        const discount = Math.round(((originalPrice - product.price) / originalPrice) * 100);

        // Update breadcrumb
        document.getElementById('bc-category').textContent = product.category || 'Products';
        document.getElementById('bc-name').textContent = product.name;
        document.title = `${product.name} - Farmer Medicine Shop`;

        const container = document.getElementById('detail-container');
        container.innerHTML = `
      <div class="detail-card">
        <!-- Image Panel -->
        <div class="detail-image-panel">
          <img
            class="detail-main-image"
            src="${product.image}"
            alt="${product.name}"
            onerror="this.src='images/placeholder.png'"
          />
        </div>

        <!-- Info Panel -->
        <div class="detail-info-panel">
          <div class="detail-category-badge">${product.category || 'General'}</div>
          <h1 class="detail-name">${product.name}</h1>
          <div class="detail-rating">
            ★★★★☆ <span>(4.1 / 5 · Farmer's Choice)</span>
          </div>

          <!-- Price -->
          <div class="detail-price-block">
            <div class="detail-price">₹${product.price}</div>
            <div class="detail-original-price">₹${originalPrice}</div>
            <div class="detail-discount-badge">${discount}% OFF</div>
          </div>

          <!-- Stock -->
          <p class="detail-stock ${inStock ? 'in-stock' : 'out-stock'}">
            ${inStock
                ? (stockCount !== null ? `✅ In Stock (${stockCount} available)` : '✅ In Stock')
                : '❌ Out of Stock'}
          </p>

          <!-- Description -->
          <p class="detail-desc">${productDesc}</p>

          <!-- Quantity -->
          <div class="quantity-row">
            <label>Quantity:</label>
            <div class="qty-control">
              <button onclick="changeQty(-1)" title="Decrease">−</button>
              <input type="number" id="qty-input" value="1" min="1" max="${stockCount || 99}" />
              <button onclick="changeQty(1)" title="Increase">+</button>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="detail-actions">
            <button class="btn-add-cart" onclick="handleAddToCart('${productId}')" ${!inStock ? 'disabled style="opacity:0.5;cursor:not-allowed"' : ''}>
              🛒 Add to Cart
            </button>
            <button class="btn-buy-now" onclick="handleBuyNow('${productId}')" ${!inStock ? 'disabled style="opacity:0.5;cursor:not-allowed"' : ''}>
              ⚡ Buy Now
            </button>
          </div>

          <!-- Info Tags -->
          <div class="detail-tags">
            <div class="detail-tag">🚚 Free delivery on orders ₹500+</div>
            <div class="detail-tag">↩️ Easy 7-day returns</div>
            <div class="detail-tag">🔒 Secure payment</div>
            <div class="detail-tag">🌿 100% Genuine product</div>
          </div>
        </div>
      </div>
    `;
    }

    // ---- Qty control (globally accessible via onclick) ----
    window.changeQty = function (delta) {
        const input = document.getElementById('qty-input');
        if (!input) return;
        let value = parseInt(input.value) || 1;
        value = Math.max(1, Math.min(parseInt(input.max) || 99, value + delta));
        input.value = value;
    };

    // ---- Handle Add to Cart ----
    window.handleAddToCart = function (id) {
        const qty = getQuantity();
        for (let i = 0; i < qty; i++) {
            addToCart(id); // calls the existing addToCart from script.js
        }
        showToast(`✅ Added ${qty} item${qty > 1 ? 's' : ''} to cart!`);
    };

    // ---- Handle Buy Now ----
    window.handleBuyNow = function (id) {
        const qty = getQuantity();
        // Clear cart and add only this item, then redirect to checkout
        localStorage.removeItem('cart');
        for (let i = 0; i < qty; i++) {
            addToCart(id);
        }
        showToast('⚡ Redirecting to checkout...', '#e65c00');
        setTimeout(() => {
            window.location.href = 'checkout.html';
        }, 800);
    };

    // ---- Fetch product and render ----
    async function init() {
        if (!productId) {
            document.getElementById('detail-container').innerHTML = `
        <div class="detail-error">
          <div class="err-icon">🌾</div>
          <h2>Product Not Found</h2>
          <p>No product ID was provided in the URL.</p>
          <a href="./">← Back to Shop</a>
        </div>`;
            return;
        }

        try {
            // Try fetching from backend API
            const baseUrl = window.API_BASE_URL || '/api';
            const response = await fetch(`${baseUrl}/products/${productId}`);
            if (!response.ok) throw new Error('Product not found');
            const product = await response.json();
            renderDetail(product);
        } catch (err) {
            // Fallback: look in the local fallbackProducts array (from script.js)
            if (typeof fallbackProducts !== 'undefined') {
                const local = fallbackProducts.find(p => String(p.id) === String(productId) || String(p._id) === String(productId));
                if (local) {
                    renderDetail(local);
                    return;
                }
            }

            document.getElementById('detail-container').innerHTML = `
        <div class="detail-error">
          <div class="err-icon">⚠️</div>
          <h2>Product Not Found</h2>
          <p>We couldn't load this product. It may have been removed.</p>
          <a href="./">← Back to Shop</a>
        </div>`;
        }
    }

    init();
})();
