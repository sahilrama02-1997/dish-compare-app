# 🚂 Deploy Backend to Railway (Free)

## **Step-by-Step Guide:**

### **1. Create Railway Account**
- Go to: https://railway.app
- Sign up with GitHub
- Connect your GitHub account

### **2. Deploy from GitHub**
- Click "New Project"
- Select "Deploy from GitHub repo"
- Choose: `sahilrama02-1997/dish-compare-app`
- Select folder: `backend/`

### **3. Configure Environment Variables**
Add these in Railway dashboard:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dishcompare
JWT_SECRET=your-super-secret-jwt-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### **4. Get Backend URL**
Railway will give you: `https://your-app-name.railway.app`

### **5. Update Frontend**
Change API base URL in frontend to your Railway URL.

## **Benefits:**
- ✅ **Free tier** (500 hours/month)
- ✅ **Automatic deployments** from GitHub
- ✅ **Built-in MongoDB** option
- ✅ **Environment variables** management
- ✅ **Custom domains** available
