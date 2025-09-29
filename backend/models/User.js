const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Basic user information
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    unique: true,
    sparse: true, // Allows null values but ensures uniqueness when present
    trim: true,
    match: [/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number']
  },
  
  // Authentication methods
  authMethod: {
    type: String,
    enum: ['gmail', 'phone'],
    required: true
  },
  
  // Gmail OAuth
  googleId: {
    type: String,
    sparse: true,
    unique: true
  },
  googleEmail: {
    type: String,
    sparse: true
  },
  
  // Phone verification
  phoneVerified: {
    type: Boolean,
    default: false
  },
  phoneVerificationCode: {
    type: String,
    sparse: true
  },
  phoneVerificationExpires: {
    type: Date,
    sparse: true
  },
  
  // Email verification
  emailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationCode: {
    type: String,
    sparse: true
  },
  emailVerificationExpires: {
    type: Date,
    sparse: true
  },
  
  // User preferences
  preferences: {
    defaultWeights: {
      taste: { type: Number, default: 30 },
      presentation: { type: Number, default: 20 },
      texture: { type: Number, default: 25 },
      aroma: { type: Number, default: 15 },
      value: { type: Number, default: 10 }
    },
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false }
    }
  },
  
  // Statistics
  stats: {
    totalComparisons: { type: Number, default: 0 },
    favoriteDish: { type: String, default: null },
    lastActive: { type: Date, default: Date.now }
  },
  
  // Account status
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better performance
userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });
userSchema.index({ googleId: 1 });
userSchema.index({ createdAt: -1 });

// Virtual for user's full profile
userSchema.virtual('profile').get(function() {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    phone: this.phone,
    authMethod: this.authMethod,
    preferences: this.preferences,
    stats: this.stats,
    isActive: this.isActive,
    createdAt: this.createdAt
  };
});

// Method to update last active
userSchema.methods.updateLastActive = function() {
  this.stats.lastActive = new Date();
  this.lastLogin = new Date();
  return this.save();
};

// Method to increment comparison count
userSchema.methods.incrementComparisons = function() {
  this.stats.totalComparisons += 1;
  return this.save();
};

// Method to update favorite dish
userSchema.methods.updateFavoriteDish = function(dishName) {
  this.stats.favoriteDish = dishName;
  return this.save();
};

// Pre-save middleware to update timestamps
userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Static method to find user by email or phone
userSchema.statics.findByEmailOrPhone = function(identifier) {
  return this.findOne({
    $or: [
      { email: identifier },
      { phone: identifier }
    ]
  });
};

// Static method to get user statistics
userSchema.statics.getUserStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: null,
        totalUsers: { $sum: 1 },
        activeUsers: { $sum: { $cond: ['$isActive', 1, 0] } },
        totalComparisons: { $sum: '$stats.totalComparisons' },
        avgComparisons: { $avg: '$stats.totalComparisons' }
      }
    }
  ]);
};

module.exports = mongoose.model('User', userSchema);
