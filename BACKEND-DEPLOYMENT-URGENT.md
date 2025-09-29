# 🚨 URGENT: Deploy Backend to Get Live API URL

## **🎯 What You Need:**
A **live backend URL** like: `https://your-backend.railway.app` or `https://your-backend.onrender.com`

## **🚀 Quick Deployment Options (Choose One):**

### **Option 1: Railway (Fastest - 3 minutes)**
1. **Go to**: https://railway.app
2. **Sign up** with GitHub
3. **Click "New Project"**
4. **Select "Deploy from GitHub repo"**
5. **Choose**: `sahilrama02-1997/dish-compare-app`
6. **Set Root Directory**: `backend`
7. **Deploy** → Get URL: `https://dishcompare-backend-production.railway.app`

### **Option 2: Render (Most Popular - 5 minutes)**
1. **Go to**: https://render.com
2. **Sign up** with GitHub
3. **Click "New +" → "Web Service"**
4. **Connect GitHub**: `sahilrama02-1997/dish-compare-app`
5. **Root Directory**: `backend`
6. **Build Command**: `npm install`
7. **Start Command**: `npm start`
8. **Deploy** → Get URL: `https://dishcompare-backend.onrender.com`

### **Option 3: Heroku (Most Features - 10 minutes)**
1. **Install Heroku CLI**: `brew install heroku`
2. **Login**: `heroku login`
3. **Create app**: `heroku create dishcompare-backend`
4. **Deploy**: `git push heroku main`
5. **Get URL**: `https://dishcompare-backend.herokuapp.com`

## **🔧 After Deployment - Update Frontend:**

Once you get your backend URL, update the frontend to use it:

```javascript
// In your frontend JavaScript, change:
const API_BASE_URL = 'https://your-backend-url.railway.app';
// or
const API_BASE_URL = 'https://your-backend-url.onrender.com';
```

## **📱 Test Your Backend:**

Once deployed, test these URLs:
- **Health Check**: `https://your-backend-url.railway.app/api/health`
- **Auth Endpoint**: `https://your-backend-url.railway.app/api/auth/google`
- **User Endpoint**: `https://your-backend-url.railway.app/api/users/profile`

## **⚡ Quick Start (Recommended):**

**Use Railway** - it's the fastest:
1. Go to https://railway.app
2. Connect GitHub
3. Deploy `backend` folder
4. Get your API URL
5. Update frontend with the URL

**Your backend will be live in 3 minutes!** 🚀
