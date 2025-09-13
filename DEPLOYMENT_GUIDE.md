# 🚀 Vercel Deployment Guide - Farmer Medicine Shop

## ✅ **FIXES APPLIED**

### **1. API URL Mismatch - FIXED ✅**
- Updated frontend to use correct API endpoints (`/api/auth/login` instead of `/auth/login`)
- Created dynamic API configuration for development/production environments

### **2. JWT Authentication - FIXED ✅**
- Added JWT token generation in backend auth routes
- Updated login/signup responses to include JWT tokens

### **3. CORS Configuration - FIXED ✅**
- Updated CORS settings for production domains
- Added environment-based configuration

### **4. MongoDB Connection - FIXED ✅**
- Created production configuration for MongoDB Atlas
- Added fallback configurations

---

## 📋 **DEPLOYMENT REQUIREMENTS**

### **Prerequisites:**
1. ✅ Node.js installed
2. ✅ Vercel CLI installed
3. ✅ MongoDB Atlas account (free)
4. ✅ Git repository

---

## 🔧 **STEP-BY-STEP DEPLOYMENT**

### **Step 1: Set up MongoDB Atlas**

1. **Go to MongoDB Atlas**: https://www.mongodb.com/atlas
2. **Create free account** and cluster
3. **Get connection string**:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/farmershop?retryWrites=true&w=majority
   ```
4. **Replace username/password** with your actual credentials

### **Step 2: Install Vercel CLI**

```bash
npm install -g vercel
```

### **Step 3: Deploy Backend**

```bash
# Navigate to backend directory
cd backend

# Login to Vercel
vercel login

# Deploy backend
vercel

# Note the deployment URL (e.g., https://your-backend.vercel.app)
```

### **Step 4: Configure Environment Variables**

In Vercel dashboard for your backend project:

1. Go to **Settings** → **Environment Variables**
2. Add these variables:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/farmershop?retryWrites=true&w=majority
   JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend.vercel.app
   ```

### **Step 5: Update Frontend Configuration**

1. **Update `frontend/js/config.js`**:
   ```javascript
   production: {
     baseURL: 'https://your-backend.vercel.app/api'  // Replace with your actual backend URL
   }
   ```

### **Step 6: Deploy Frontend**

```bash
# Navigate to frontend directory
cd frontend

# Deploy frontend
vercel

# Note the deployment URL (e.g., https://your-frontend.vercel.app)
```

### **Step 7: Update Backend CORS**

1. **Update backend environment variable**:
   ```
   FRONTEND_URL=https://your-frontend.vercel.app
   ```

2. **Redeploy backend**:
   ```bash
   cd backend
   vercel --prod
   ```

---

## 🎯 **QUICK DEPLOYMENT COMMANDS**

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Deploy backend
cd backend
vercel login
vercel

# 3. Deploy frontend
cd ../frontend
vercel

# 4. Update config files with actual URLs
# 5. Set environment variables in Vercel dashboard
# 6. Redeploy both projects
```

---

## 🔍 **VERIFICATION STEPS**

### **Backend Health Check:**
```bash
curl https://your-backend.vercel.app/api/health
```

Expected response:
```json
{
  "message": "Farmer Medicine Shop API is running!",
  "status": "healthy"
}
```

### **Frontend Test:**
1. Open your frontend URL
2. Try to register a new user
3. Try to login
4. Check if products load

---

## 🚨 **TROUBLESHOOTING**

### **Common Issues:**

1. **CORS Errors:**
   - Check FRONTEND_URL environment variable
   - Ensure URLs match exactly

2. **MongoDB Connection Issues:**
   - Verify MONGO_URI is correct
   - Check Atlas network access settings
   - Ensure database name is correct

3. **API Not Found:**
   - Check if backend is deployed correctly
   - Verify API endpoints in frontend config

4. **Authentication Issues:**
   - Check JWT_SECRET is set
   - Verify token generation in backend

---

## 📁 **FINAL PROJECT STRUCTURE**

```
farmer-medicine-shop/
├── backend/
│   ├── config/
│   │   ├── db.js
│   │   ├── environment.js
│   │   └── production.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Order.js
│   │   └── Product.js
│   ├── routes/
│   │   ├── auth.js (with JWT)
│   │   ├── order.js
│   │   └── product.js
│   ├── server.js
│   ├── package.json
│   └── vercel.json
├── frontend/
│   ├── js/
│   │   └── config.js (dynamic API config)
│   ├── index.html
│   ├── login.html
│   ├── signup.html
│   ├── cart.html
│   ├── checkout.html
│   ├── order-confirmation.html
│   ├── about.html
│   ├── forget.html
│   ├── script.js (updated with dynamic URLs)
│   ├── style.css
│   └── vercel.json
├── package.json
├── vercel.json
└── DEPLOYMENT_GUIDE.md
```

---

## 🎉 **SUCCESS INDICATORS**

✅ Backend API responds to health check  
✅ Frontend loads without errors  
✅ User registration works  
✅ User login works  
✅ Products display correctly  
✅ Cart functionality works  
✅ No CORS errors in browser console  

---

## 📞 **NEXT STEPS AFTER DEPLOYMENT**

1. **Set up custom domains** (optional)
2. **Configure monitoring** (optional)
3. **Set up CI/CD** for automatic deployments
4. **Add error tracking** (Sentry, etc.)
5. **Implement caching** for better performance

---

**🎯 Your project is now ready for production deployment!**
