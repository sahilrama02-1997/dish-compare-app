#!/bin/bash

# DishCompare App - AWS Deployment Script
# This script deploys the app to AWS S3 with CloudFront

set -e

# Configuration
BUCKET_NAME="dishcompare-app-$(date +%s)"
REGION="us-east-1"
STACK_NAME="dishcompare-stack"

echo "🚀 Starting DishCompare AWS Deployment..."

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed. Please install it first:"
    echo "   https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html"
    exit 1
fi

# Check if user is logged in to AWS
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ Please configure AWS CLI first:"
    echo "   aws configure"
    exit 1
fi

echo "✅ AWS CLI configured"

# Create S3 bucket for static hosting
echo "📦 Creating S3 bucket: $BUCKET_NAME"
aws s3 mb s3://$BUCKET_NAME --region $REGION

# Configure bucket for static website hosting
echo "🌐 Configuring static website hosting..."
aws s3 website s3://$BUCKET_NAME --index-document index.html --error-document index.html

# Upload files to S3
echo "📤 Uploading files to S3..."
aws s3 sync . s3://$BUCKET_NAME --exclude "*.git/*" --exclude "*.md" --exclude "*.yml" --exclude "*.sh"

# Set bucket policy for public read access
echo "🔓 Setting bucket policy..."
cat > bucket-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::$BUCKET_NAME/*"
        }
    ]
}
EOF

aws s3api put-bucket-policy --bucket $BUCKET_NAME --policy file://bucket-policy.json
rm bucket-policy.json

# Get the website URL
WEBSITE_URL="http://$BUCKET_NAME.s3-website-$REGION.amazonaws.com"

echo ""
echo "🎉 Deployment successful!"
echo "📍 Website URL: $WEBSITE_URL"
echo ""
echo "📋 Next steps:"
echo "1. Test your website at: $WEBSITE_URL"
echo "2. Set up CloudFront for better performance and HTTPS"
echo "3. Configure custom domain (optional)"
echo "4. Set up CI/CD pipeline with GitHub Actions"
echo ""
echo "🔧 To set up CloudFront, run:"
echo "   aws cloudfront create-distribution --distribution-config file://cloudfront-config.json"
echo ""
echo "📱 For iOS deployment, see ios-setup.md"
