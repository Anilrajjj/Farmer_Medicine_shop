const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../products.json');

let products = [];

// Load products from file
const loadProducts = () => {
  try {
    const data = fs.readFileSync(productsFilePath, 'utf8');
    products = JSON.parse(data);
  } catch (err) {
    console.error('Error loading products:', err);
    products = [];
  }
};

// Save products to file
const saveProducts = () => {
  try {
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
  } catch (err) {
    console.error('Error saving products:', err);
  }
};

// Initialize
loadProducts();

class Product {
  constructor(data) {
    this.id = data.id || Date.now();
    this.name = data.name;
    this.description = data.description;
    this.price = data.price;
    this.category = data.category;
    this.image = data.image;
    this.stock = data.stock || 0;
    this.isActive = data.isActive !== undefined ? data.isActive : true;
  }

  static find(query = {}) {
    let filtered = products.filter(p => p.isActive);

    if (query.category && query.category !== 'all') {
      filtered = filtered.filter(p => p.category === query.category);
    }

    if (query.$or) {
      filtered = filtered.filter(p => {
        return query.$or.some(condition => {
          if (condition.name && condition.name.$regex) {
            return new RegExp(condition.name.$regex, condition.name.$options).test(p.name);
          }
          if (condition.description && condition.description.$regex) {
            return new RegExp(condition.description.$regex, condition.description.$options).test(p.description);
          }
          return false;
        });
      });
    }

    return filtered;
  }

  static findById(id) {
    const product = products.find(p => p.id == id);
    return product && product.isActive ? product : null;
  }

  static countDocuments(query = {}) {
    return this.find(query).length;
  }

  save() {
    products.push(this);
    saveProducts();
    return this;
  }

  static findByIdAndUpdate(id, updateData, options = {}) {
    const index = products.findIndex(p => p.id == id);
    if (index === -1) return null;

    products[index] = { ...products[index], ...updateData };
    if (options.new) {
      saveProducts();
    }
    return products[index];
  }

  static insertMany(productsData) {
    const newProducts = productsData.map(data => new Product(data));
    products.push(...newProducts);
    saveProducts();
    return newProducts;
  }

  static deleteMany() {
    products = [];
    saveProducts();
  }

  static findAll() {
    return products;
  }
}

module.exports = Product;
