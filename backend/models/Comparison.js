const mongoose = require('mongoose');

const comparisonSchema = new mongoose.Schema({
  // User reference
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Dish information
  dish1: {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    scores: {
      taste: { type: Number, required: true, min: 1, max: 10 },
      presentation: { type: Number, required: true, min: 1, max: 10 },
      texture: { type: Number, required: true, min: 1, max: 10 },
      aroma: { type: Number, required: true, min: 1, max: 10 },
      value: { type: Number, required: true, min: 1, max: 10 }
    },
    finalScore: { type: Number, required: true }
  },
  
  dish2: {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    scores: {
      taste: { type: Number, required: true, min: 1, max: 10 },
      presentation: { type: Number, required: true, min: 1, max: 10 },
      texture: { type: Number, required: true, min: 1, max: 10 },
      aroma: { type: Number, required: true, min: 1, max: 10 },
      value: { type: Number, required: true, min: 1, max: 10 }
    },
    finalScore: { type: Number, required: true }
  },
  
  // Comparison settings
  weights: {
    taste: { type: Number, required: true, min: 0, max: 100 },
    presentation: { type: Number, required: true, min: 0, max: 100 },
    texture: { type: Number, required: true, min: 0, max: 100 },
    aroma: { type: Number, required: true, min: 0, max: 100 },
    value: { type: Number, required: true, min: 0, max: 100 }
  },
  
  // Results
  winner: {
    dish: { type: String, required: true },
    score: { type: Number, required: true }
  },
  
  // Additional information
  notes: {
    type: String,
    maxlength: 500,
    trim: true
  },
  
  // Location (optional)
  location: {
    name: { type: String, trim: true },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number }
    }
  },
  
  // Tags for categorization
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  
  // Visibility settings
  isPublic: {
    type: Boolean,
    default: false
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
comparisonSchema.index({ userId: 1, createdAt: -1 });
comparisonSchema.index({ 'dish1.name': 1 });
comparisonSchema.index({ 'dish2.name': 1 });
comparisonSchema.index({ tags: 1 });
comparisonSchema.index({ isPublic: 1 });

// Virtual for comparison summary
comparisonSchema.virtual('summary').get(function() {
  return {
    id: this._id,
    dish1: this.dish1.name,
    dish2: this.dish2.name,
    winner: this.winner.dish,
    winnerScore: this.winner.score,
    createdAt: this.createdAt
  };
});

// Method to calculate final scores
comparisonSchema.methods.calculateFinalScores = function() {
  const weights = this.weights;
  const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
  
  if (totalWeight === 0) {
    throw new Error('Total weight cannot be zero');
  }
  
  // Calculate dish1 final score
  const dish1Score = (
    (this.dish1.scores.taste * weights.taste) +
    (this.dish1.scores.presentation * weights.presentation) +
    (this.dish1.scores.texture * weights.texture) +
    (this.dish1.scores.aroma * weights.aroma) +
    (this.dish1.scores.value * weights.value)
  ) / totalWeight;
  
  // Calculate dish2 final score
  const dish2Score = (
    (this.dish2.scores.taste * weights.taste) +
    (this.dish2.scores.presentation * weights.presentation) +
    (this.dish2.scores.texture * weights.texture) +
    (this.dish2.scores.aroma * weights.aroma) +
    (this.dish2.scores.value * weights.value)
  ) / totalWeight;
  
  this.dish1.finalScore = Math.round(dish1Score * 10) / 10;
  this.dish2.finalScore = Math.round(dish2Score * 10) / 10;
  
  // Determine winner
  if (this.dish1.finalScore > this.dish2.finalScore) {
    this.winner = {
      dish: this.dish1.name,
      score: this.dish1.finalScore
    };
  } else if (this.dish2.finalScore > this.dish1.finalScore) {
    this.winner = {
      dish: this.dish2.name,
      score: this.dish2.finalScore
    };
  } else {
    this.winner = {
      dish: 'Tie',
      score: this.dish1.finalScore
    };
  }
  
  return this;
};

// Static method to get user's comparison statistics
comparisonSchema.statics.getUserStats = function(userId) {
  return this.aggregate([
    { $match: { userId: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        totalComparisons: { $sum: 1 },
        favoriteDish: {
          $first: {
            $cond: [
              { $gt: ['$dish1.finalScore', '$dish2.finalScore'] },
              '$dish1.name',
              '$dish2.name'
            ]
          }
        },
        avgScore: { $avg: { $max: ['$dish1.finalScore', '$dish2.finalScore'] } },
        mostUsedWeights: {
          $first: {
            taste: { $avg: '$weights.taste' },
            presentation: { $avg: '$weights.presentation' },
            texture: { $avg: '$weights.texture' },
            aroma: { $avg: '$weights.aroma' },
            value: { $avg: '$weights.value' }
          }
        }
      }
    }
  ]);
};

// Static method to get popular dishes
comparisonSchema.statics.getPopularDishes = function(limit = 10) {
  return this.aggregate([
    { $match: { isPublic: true } },
    {
      $project: {
        dishes: ['$dish1.name', '$dish2.name'],
        scores: ['$dish1.finalScore', '$dish2.finalScore']
      }
    },
    { $unwind: '$dishes' },
    { $unwind: '$scores' },
    {
      $group: {
        _id: '$dishes',
        count: { $sum: 1 },
        avgScore: { $avg: '$scores' }
      }
    },
    { $sort: { count: -1, avgScore: -1 } },
    { $limit: limit }
  ]);
};

// Pre-save middleware to calculate final scores
comparisonSchema.pre('save', function(next) {
  if (this.isModified('dish1.scores') || this.isModified('dish2.scores') || this.isModified('weights')) {
    this.calculateFinalScores();
  }
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Comparison', comparisonSchema);
