# 🎨 Deploy Backend to Render (Free)

## **Step-by-Step Guide:**

### **1. Create Render Account**
- Go to: https://render.com
- Sign up with GitHub
- Connect your GitHub account

### **2. Create New Web Service**
- Click "New +" → "Web Service"
- Connect GitHub repository: `sahilrama02-1997/dish-compare-app`
- **Root Directory**: `backend`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### **3. Configure Environment**
- **Node Version**: 18.x
- **Region**: Choose closest to your users

### **4. Add Environment Variables**
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dishcompare
JWT_SECRET=your-super-secret-jwt-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
FRONTEND_URL=https://your-frontend-url.netlify.app
```

### **5. Deploy**
- Click "Create Web Service"
- Wait for deployment (2-3 minutes)
- Get URL: `https://your-app-name.onrender.com`

## **Benefits:**
- ✅ **Free tier** (750 hours/month)
- ✅ **Automatic SSL** certificates
- ✅ **Zero-config** deployments
- ✅ **Built-in monitoring**
- ✅ **Custom domains** available
