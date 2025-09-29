# 🚂 Railway Deployment Guide - Step by Step

## **🎯 Goal: Get Your Backend API URL**
We need to deploy the backend to get a URL like: `https://dishcompare-backend-production.railway.app`

## **📋 Step-by-Step Instructions:**

### **Step 1: Access Railway**
1. **Go to**: https://railway.app
2. **Click "Login"** (top right corner)
3. **Select "Login with GitHub"**
4. **Authorize Railway** to access your GitHub repositories

### **Step 2: Create New Project**
1. **Click "New Project"** (big blue button on dashboard)
2. **Select "Deploy from GitHub repo"**
3. **Find your repository**: `sahilrama02-1997/dish-compare-app`
4. **Click "Deploy"**

### **Step 3: Configure for Backend**
1. **Wait for initial deployment** (2-3 minutes)
2. **Click on your project** to open it
3. **Go to "Settings" tab**
4. **Find "Root Directory"** setting
5. **Set to**: `backend`
6. **Click "Save"**

### **Step 4: Get Your API URL**
1. **Go to "Deployments" tab**
2. **Click on the latest deployment**
3. **Copy the URL** (starts with `https://`)
4. **Test it**: Add `/api/health` to the end
   - Example: `https://your-app.railway.app/api/health`
   - Should show: `{"status":"OK"}`

## **🔧 What Happens During Deployment:**

### **Railway Will:**
- ✅ **Detect Node.js** project automatically
- ✅ **Install dependencies** (`npm install`)
- ✅ **Start the server** (`npm start`)
- ✅ **Provide HTTPS URL** for your API
- ✅ **Handle restarts** if server crashes

### **You'll Get:**
- 🌐 **Public API URL**: `https://your-app.railway.app`
- 🔗 **Health Check**: `https://your-app.railway.app/api/health`
- 📧 **Gmail OAuth**: `https://your-app.railway.app/api/auth/google`
- 📱 **Phone OTP**: `https://your-app.railway.app/api/auth/register/phone`

## **⚡ Quick Test Commands:**

Once deployed, test these URLs in your browser:

```bash
# Health check (should show "OK")
https://your-app.railway.app/api/health

# Gmail OAuth (should redirect to Google)
https://your-app.railway.app/api/auth/google

# API documentation
https://your-app.railway.app/api/
```

## **🚨 If Deployment Fails:**

### **Common Issues:**
1. **Build Error**: Check Railway logs for specific error
2. **Port Issue**: Railway handles this automatically
3. **Dependencies**: Railway installs from package.json

### **Solutions:**
1. **Check logs** in Railway dashboard
2. **Verify package.json** has correct dependencies
3. **Ensure server.js** starts correctly

## **🎯 Next Steps After Deployment:**

1. **Copy your API URL**
2. **Test the health endpoint**
3. **Update frontend** to use your API URL
4. **Add Gmail + OTP signup** to frontend

## **📱 Expected Result:**

After successful deployment, you'll have:
- ✅ **Live backend API**
- ✅ **Gmail OAuth working**
- ✅ **Phone OTP system ready**
- ✅ **Database connection** (when configured)

**Ready to start? Go to https://railway.app and follow the steps above!** 🚀
