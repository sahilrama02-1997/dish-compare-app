# DishCompare - Food Tasting Comparison App

A modern web application for comparing dishes using weighted tasting parameters. Rate and compare dishes based on taste, presentation, texture, aroma, and value with customizable weights.

## Features

- **Weighted Parameter System**: Customize the importance of different tasting criteria
- **User Authentication**: Sign up and login system with persistent data
- **Interactive Comparison**: Real-time scoring with visual feedback
- **Personal Dashboard**: Track your comparisons and preferences
- **Responsive Design**: Works on desktop and mobile devices
- **Data Persistence**: Your comparisons and preferences are saved locally

## How to Run the App

### Option 1: Simple File Opening
1. Navigate to the `dish-compare-app` folder
2. Double-click on `index.html` to open it in your default browser
3. The app will load and be ready to use!

### Option 2: Local Server (Recommended)
1. Open Terminal/Command Prompt
2. Navigate to the `dish-compare-app` folder:
   ```bash
   cd /Users/artuxsociety/dish-compare-app
   ```
3. Start a local server:
   ```bash
   # Using Python 3
   python3 -m http.server 8000
   
   # Or using Node.js (if you have it installed)
   npx serve .
   
   # Or using PHP
   php -S localhost:8000
   ```
4. Open your browser and go to `http://localhost:8000`

## How to Use the App

### 1. Getting Started
- Open the app in your browser
- Click "Sign Up" to create an account (or "Login" if you already have one)
- Fill in your details and create your account

### 2. Comparing Dishes
- Click on "Compare" in the navigation
- Enter the names of two dishes you want to compare
- Rate each dish on 5 parameters:
  - **Taste** (1-10): How good does it taste?
  - **Presentation** (1-10): How appealing does it look?
  - **Texture** (1-10): How does it feel in your mouth?
  - **Aroma** (1-10): How good does it smell?
  - **Value** (1-10): Is it worth the price?

### 3. Adjusting Weights
- Use the weight sliders to customize how important each parameter is to you
- For example, if taste is most important, increase the taste weight
- The weights automatically adjust to add up to 100%

### 4. Viewing Results
- Click "Compare Dishes" to see the results
- The app calculates weighted scores and shows which dish wins
- View detailed breakdowns of each dish's performance

### 5. Dashboard & Profile
- **Dashboard**: See your recent comparisons and preferences
- **Profile**: View your stats and favorite dishes

## App Structure

```
dish-compare-app/
├── index.html          # Main HTML file
├── css/
│   └── styles.css      # All styling and responsive design
├── js/
│   └── app.js          # All functionality and logic
├── ios-setup.md        # iOS deployment guide
└── README.md           # This file
```

## Deployment Options

### AWS Deployment
- **S3 Static Hosting**: Host the web app on AWS S3
- **CloudFront CDN**: Global content delivery for better performance
- **Route 53**: Custom domain configuration
- **Lambda Functions**: Backend API for user data (optional)

### iOS App Store
- **PWA Conversion**: Convert to Progressive Web App
- **Cordova/PhoneGap**: Hybrid mobile app
- **Capacitor**: Modern hybrid approach
- **React Native**: Full native rebuild

See `ios-setup.md` for detailed iOS deployment instructions.

## Key Features Explained

### Weighted Scoring System
The app uses a sophisticated weighted scoring system:
- Each parameter has a weight (percentage)
- Final score = (Taste × Taste Weight) + (Presentation × Presentation Weight) + ...
- Weights are normalized to always add up to 100%

### Data Storage
- All data is stored in your browser's local storage
- Your comparisons, preferences, and profile persist between sessions
- No data is sent to external servers

### Responsive Design
- Works on desktop, tablet, and mobile devices
- Touch-friendly sliders and buttons
- Optimized layouts for different screen sizes

## Technical Details

- **Frontend**: Pure HTML, CSS, and JavaScript (no frameworks required)
- **Storage**: Browser localStorage for data persistence
- **Responsive**: CSS Grid and Flexbox for modern layouts
- **Icons**: Font Awesome for consistent iconography
- **Animations**: CSS transitions and keyframe animations

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

## Future Enhancements

Potential features you could add:
- Export comparisons to PDF
- Share comparisons with friends
- Photo uploads for dishes
- Social features and user reviews
- Advanced analytics and charts
- Integration with restaurant APIs

## Support

This is a complete, working application. All the code is provided and ready to run. If you encounter any issues, check that all files are in the correct locations and try refreshing your browser.

Enjoy comparing dishes! 🍽️
