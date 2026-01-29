// Admin Dashboard JavaScript
let currentSection = 'dashboard';

// Initialize admin dashboard
document.addEventListener('DOMContentLoaded', function() {
  // Check if user is admin
  if (!currentUser || currentUser.role !== 'admin') {
    alert('Access denied. Admin privileges required.');
    window.location.href = 'index.html';
    return;
  }

  // Display admin info
  document.getElementById('admin-info').innerHTML = `
    <strong>${currentUser.firstName} ${currentUser.lastName}</strong><br>
    <small>Admin</small>
  `;

  // Load dashboard data
  loadDashboardStats();
  loadProducts();
  loadOrders();
});

// Show different sections
function showSection(sectionName) {
  // Hide all sections
  document.querySelectorAll('.admin-section').forEach(section => {
    section.classList.remove('active');
  });

  // Remove active class from nav buttons
  document.querySelectorAll('.admin-nav button').forEach(btn => {
    btn.classList.remove('active');
  });

  // Show selected section
  document.getElementById(`${sectionName}-section`).classList.add('active');
  document.getElementById(`${sectionName}-btn`).classList.add('active');

  currentSection = sectionName;
}

// Load dashboard statistics
async function loadDashboardStats() {
  try {
    const [productsRes, ordersRes] = await Promise.all([
      apiRequest('/products'),
      apiRequest('/orders/admin/all?limit=1000')
    ]);

    const products = productsRes.products || [];
    const orders = ordersRes.orders || [];

    // Calculate stats
    const totalProducts = products.length;
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(order => order.status === 'Pending').length;
    const totalRevenue = orders
      .filter(order => order.status === 'Delivered')
      .reduce((sum, order) => sum + order.totalAmount, 0);

    // Update UI
    document.getElementById('total-products').textContent = totalProducts;
    document.getElementById('total-orders').textContent = totalOrders;
    document.getElementById('pending-orders').textContent = pendingOrders;
    document.getElementById('total-revenue').textContent = `₹${totalRevenue.toLocaleString()}`;

  } catch (error) {
    console.error('Error loading dashboard stats:', error);
  }
}

// Load products for management
async function loadProducts() {
  try {
    const data = await apiRequest('/products/admin/all');
    const products = data || [];

    const tbody = document.getElementById('products-tbody');
    tbody.innerHTML = '';

    if (products.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7">No products found</td></tr>';
      return;
    }

    products.forEach(product => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td><img src="${product.image}" alt="${product.name}" style="width: 50px; height: 50px; object-fit: cover;"></td>
        <td>${product.name}</td>
        <td>${product.category}</td>
        <td>₹${product.price}</td>
        <td>${product.stock}</td>
        <td>${product.isActive ? 'Active' : 'Inactive'}</td>
        <td>
          <button class="btn" onclick="editProduct('${product._id}')">Edit</button>
          <button class="btn btn-danger" onclick="deleteProduct('${product._id}', '${product.name}')">Delete</button>
        </td>
      `;
      tbody.appendChild(row);
    });

  } catch (error) {
    console.error('Error loading products:', error);
    document.getElementById('products-tbody').innerHTML =
      '<tr><td colspan="7" class="error">Error loading products</td></tr>';
  }
}

// Load orders for management
async function loadOrders() {
  try {
    const data = await apiRequest('/orders/admin/all');
    const orders = data.orders || [];

    const tbody = document.getElementById('orders-tbody');
    tbody.innerHTML = '';

    if (orders.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7">No orders found</td></tr>';
      return;
    }

    orders.forEach(order => {
      const row = document.createElement('tr');
      const itemsCount = order.items.length;
      const customerName = `${order.user.firstName} ${order.user.lastName}`;

      row.innerHTML = `
        <td>${order._id.slice(-8)}</td>
        <td>${customerName}</td>
        <td>${itemsCount} item${itemsCount > 1 ? 's' : ''}</td>
        <td>₹${order.totalAmount}</td>
        <td><span class="status-badge status-${order.status.toLowerCase()}">${order.status}</span></td>
        <td>${new Date(order.createdAt).toLocaleDateString()}</td>
        <td>
          <button class="btn" onclick="viewOrder('${order._id}')">View</button>
          <select onchange="updateOrderStatus('${order._id}', this.value)">
            <option value="">Change Status</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </td>
      `;
      tbody.appendChild(row);
    });

  } catch (error) {
    console.error('Error loading orders:', error);
    document.getElementById('orders-tbody').innerHTML =
      '<tr><td colspan="7" class="error">Error loading orders</td></tr>';
  }
}

// Add new product
document.getElementById('add-product-form').addEventListener('submit', async function(e) {
  e.preventDefault();

  const formData = new FormData();
  formData.append('name', document.getElementById('product-name').value);
  formData.append('description', document.getElementById('product-description').value);
  formData.append('price', document.getElementById('product-price').value);
  formData.append('category', document.getElementById('product-category').value);
  formData.append('stock', document.getElementById('product-stock').value);

  const imageFile = document.getElementById('product-image').files[0];
  const imageUrl = document.getElementById('product-image-url').value;

  if (imageFile) {
    formData.append('image', imageFile);
  } else if (imageUrl) {
    formData.append('image', imageUrl);
  }

  try {
    await apiRequest('/products/add', {
      method: 'POST',
      headers: {}, // Let browser set content-type for FormData
      body: formData
    });

    showMessage('Product added successfully!', 'success');
    this.reset();
    loadProducts();
    loadDashboardStats();

  } catch (error) {
    console.error('Error adding product:', error);
    showMessage('Error adding product: ' + error.message, 'error');
  }
});

// Edit product
async function editProduct(productId) {
  // For now, redirect to edit page or show modal
  // This could be enhanced with a modal dialog
  alert('Edit functionality coming soon. Product ID: ' + productId);
}

// Delete product
async function deleteProduct(productId, productName) {
  if (!confirm(`Are you sure you want to delete "${productName}"?`)) {
    return;
  }

  try {
    await apiRequest(`/products/${productId}`, {
      method: 'DELETE'
    });

    showMessage('Product deleted successfully!', 'success');
    loadProducts();
    loadDashboardStats();

  } catch (error) {
    console.error('Error deleting product:', error);
    showMessage('Error deleting product: ' + error.message, 'error');
  }
}

// View order details
async function viewOrder(orderId) {
  try {
    const order = await apiRequest(`/orders/${orderId}`);

    const details = `
Order ID: ${order._id}
Customer: ${order.user.firstName} ${order.user.lastName}
Email: ${order.user.email}
Status: ${order.status}
Total: ₹${order.totalAmount}

Items:
${order.items.map(item => `- ${item.name} (x${item.quantity}) - ₹${item.price * item.quantity}`).join('\n')}

Shipping Address:
${order.shippingAddress.fullName}
${order.shippingAddress.area}
${order.shippingAddress.landmark || ''}
${order.shippingAddress.pincode}
Phone: ${order.shippingAddress.phone}
    `;

    alert(details);

  } catch (error) {
    console.error('Error viewing order:', error);
    alert('Error loading order details');
  }
}

// Update order status
async function updateOrderStatus(orderId, newStatus) {
  if (!newStatus) return;

  try {
    await apiRequest(`/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status: newStatus })
    });

    showMessage('Order status updated successfully!', 'success');
    loadOrders();
    loadDashboardStats();

  } catch (error) {
    console.error('Error updating order status:', error);
    showMessage('Error updating order status: ' + error.message, 'error');
  }
}

// Show message to user
function showMessage(message, type) {
  const messageDiv = document.createElement('div');
  messageDiv.className = type;
  messageDiv.textContent = message;

  // Remove existing messages
  const existingMessages = document.querySelectorAll('.success, .error');
  existingMessages.forEach(msg => msg.remove());

  // Add new message
  const container = document.querySelector('.admin-container');
  container.insertBefore(messageDiv, container.firstChild.nextSibling);

  // Auto remove after 5 seconds
  setTimeout(() => {
    messageDiv.remove();
  }, 5000);
}