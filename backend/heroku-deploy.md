# 🟣 Deploy Backend to Heroku (Free)

## **Step-by-Step Guide:**

### **1. Install Heroku CLI**
```bash
# macOS
brew tap heroku/brew && brew install heroku

# Or download from: https://devcenter.heroku.com/articles/heroku-cli
```

### **2. Login to Heroku**
```bash
heroku login
```

### **3. Create Heroku App**
```bash
cd /Users/artuxsociety/dish-compare-app/backend
heroku create dishcompare-backend
```

### **4. Set Environment Variables**
```bash
heroku config:set MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/dishcompare"
heroku config:set JWT_SECRET="your-super-secret-jwt-key"
heroku config:set GOOGLE_CLIENT_ID="your-google-client-id"
heroku config:set GOOGLE_CLIENT_SECRET="your-google-client-secret"
heroku config:set TWILIO_ACCOUNT_SID="your-twilio-sid"
heroku config:set TWILIO_AUTH_TOKEN="your-twilio-token"
heroku config:set EMAIL_USER="your-email@gmail.com"
heroku config:set EMAIL_PASS="your-app-password"
```

### **5. Deploy**
```bash
git add .
git commit -m "Deploy backend to Heroku"
git push heroku main
```

### **6. Get Backend URL**
```bash
heroku open
# Or check: https://dishcompare-backend.herokuapp.com
```

## **Benefits:**
- ✅ **Free tier** (550-1000 dyno hours/month)
- ✅ **Easy CLI** management
- ✅ **Add-ons** for databases
- ✅ **Automatic deployments**
- ✅ **Custom domains** available
