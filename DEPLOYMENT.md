# DishCompare App - Deployment Guide

This guide covers deploying the DishCompare app to AWS and preparing it for iOS App Store submission.

## 🚀 Quick Start

### 1. AWS Deployment (Recommended)

#### Prerequisites:
- AWS CLI installed and configured
- AWS account with appropriate permissions

#### Steps:
```bash
# Make deployment script executable
chmod +x deploy-aws.sh

# Deploy to AWS S3
./deploy-aws.sh
```

#### Manual AWS Setup:
1. **Create S3 Bucket**:
   ```bash
   aws s3 mb s3://your-bucket-name --region us-east-1
   ```

2. **Configure Static Website Hosting**:
   ```bash
   aws s3 website s3://your-bucket-name --index-document index.html --error-document index.html
   ```

3. **Upload Files**:
   ```bash
   aws s3 sync . s3://your-bucket-name --exclude "*.git/*" --exclude "*.md"
   ```

4. **Set Bucket Policy** (for public access):
   ```bash
   aws s3api put-bucket-policy --bucket your-bucket-name --policy file://bucket-policy.json
   ```

### 2. GitHub Actions CI/CD

#### Setup:
1. **Add AWS Secrets to GitHub**:
   - Go to your repository settings
   - Navigate to "Secrets and variables" → "Actions"
   - Add these secrets:
     - `AWS_ACCESS_KEY_ID`
     - `AWS_SECRET_ACCESS_KEY`
     - `CLOUDFRONT_DISTRIBUTION_ID` (optional)

2. **Push to main branch**:
   ```bash
   git add .
   git commit -m "Add AWS deployment configuration"
   git push origin main
   ```

#### What happens:
- Automatic deployment on every push to main
- Tests run before deployment
- S3 bucket created and files uploaded
- CloudFront cache invalidation (if configured)

## 📱 iOS App Store Deployment

### Option 1: PWA (Progressive Web App) - Easiest

#### Benefits:
- ✅ No App Store approval needed
- ✅ Works offline
- ✅ Native-like experience
- ✅ Automatic updates
- ✅ No development costs

#### Steps:
1. **Deploy to AWS** (see above)
2. **Test PWA functionality**:
   - Open in Safari on iOS
   - Tap "Add to Home Screen"
   - App installs like a native app

3. **PWA Features Already Included**:
   - ✅ Service Worker for offline functionality
   - ✅ Web App Manifest
   - ✅ Apple-specific meta tags
   - ✅ Responsive design

### Option 2: Cordova/PhoneGap - Hybrid App

#### Prerequisites:
- Node.js installed
- Xcode installed (for iOS development)
- Apple Developer Account ($99/year)

#### Steps:
```bash
# Install Cordova
npm install -g cordova

# Create Cordova project
cordova create dish-compare-mobile com.yourcompany.dishcompare "Dish Compare"
cd dish-compare-mobile

# Add iOS platform
cordova platform add ios

# Copy web files
cp ../index.html www/
cp -r ../css www/
cp -r ../js www/
cp ../manifest.json www/

# Build for iOS
cordova build ios

# Open in Xcode
cordova run ios
```

### Option 3: Capacitor - Modern Hybrid

#### Steps:
```bash
# Install Capacitor
npm install -g @capacitor/cli

# Initialize Capacitor
npx cap init "Dish Compare" "com.yourcompany.dishcompare"

# Add iOS platform
npx cap add ios

# Copy web assets
npx cap copy

# Open in Xcode
npx cap open ios
```

## 🔧 Configuration Files

### AWS CloudFormation Template
- `aws-deployment.yml` - Complete AWS infrastructure setup
- Includes S3, CloudFront, Route 53, SSL certificates

### GitHub Actions
- `.github/workflows/deploy.yml` - Automated CI/CD pipeline
- Tests, builds, and deploys automatically

### PWA Configuration
- `manifest.json` - PWA manifest for app-like experience
- `sw.js` - Service Worker for offline functionality
- Updated `index.html` with PWA meta tags

## 📊 Monitoring and Analytics

### AWS CloudWatch
- Monitor S3 requests and errors
- Set up alarms for high error rates
- Track CloudFront performance

### Google Analytics (Optional)
Add to `index.html`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 🚨 Troubleshooting

### Common Issues:

1. **S3 Bucket Policy Errors**:
   - Ensure bucket policy allows public read access
   - Check CORS configuration

2. **CloudFront Issues**:
   - Wait for distribution to deploy (15-20 minutes)
   - Clear browser cache
   - Check origin configuration

3. **PWA Not Installing**:
   - Ensure HTTPS is enabled
   - Check manifest.json is valid
   - Verify service worker is registered

4. **iOS Build Issues**:
   - Check Xcode version compatibility
   - Verify Apple Developer account setup
   - Ensure proper code signing

## 📈 Performance Optimization

### AWS Optimizations:
- Enable CloudFront compression
- Set appropriate cache headers
- Use S3 Transfer Acceleration for uploads

### App Optimizations:
- Minify CSS and JavaScript
- Optimize images
- Enable GZIP compression
- Use CDN for static assets

## 🔐 Security Considerations

### AWS Security:
- Use IAM roles with minimal permissions
- Enable S3 bucket versioning
- Set up CloudTrail for audit logging
- Use HTTPS everywhere

### App Security:
- Validate all user inputs
- Sanitize data before storage
- Use HTTPS for all communications
- Implement proper authentication

## 📞 Support

For issues or questions:
1. Check this deployment guide
2. Review AWS documentation
3. Check GitHub Actions logs
4. Test locally first

## 🎯 Next Steps

1. **Deploy to AWS** using the provided scripts
2. **Test PWA functionality** on mobile devices
3. **Set up monitoring** and analytics
4. **Prepare for App Store** submission (if using hybrid approach)
5. **Gather user feedback** and iterate

Your DishCompare app is now ready for production deployment! 🚀
