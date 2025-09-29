const express = require('express');
const Joi = require('joi');
const Comparison = require('../models/Comparison');

const router = express.Router();

// Validation schema for comparison
const comparisonSchema = Joi.object({
  dish1: Joi.object({
    name: Joi.string().required().max(100),
    scores: Joi.object({
      taste: Joi.number().min(1).max(10).required(),
      presentation: Joi.number().min(1).max(10).required(),
      texture: Joi.number().min(1).max(10).required(),
      aroma: Joi.number().min(1).max(10).required(),
      value: Joi.number().min(1).max(10).required()
    }).required()
  }).required(),
  dish2: Joi.object({
    name: Joi.string().required().max(100),
    scores: Joi.object({
      taste: Joi.number().min(1).max(10).required(),
      presentation: Joi.number().min(1).max(10).required(),
      texture: Joi.number().min(1).max(10).required(),
      aroma: Joi.number().min(1).max(10).required(),
      value: Joi.number().min(1).max(10).required()
    }).required()
  }).required(),
  weights: Joi.object({
    taste: Joi.number().min(0).max(100).required(),
    presentation: Joi.number().min(0).max(100).required(),
    texture: Joi.number().min(0).max(100).required(),
    aroma: Joi.number().min(0).max(100).required(),
    value: Joi.number().min(0).max(100).required()
  }).required(),
  notes: Joi.string().max(500).optional(),
  location: Joi.object({
    name: Joi.string().optional(),
    coordinates: Joi.object({
      lat: Joi.number().optional(),
      lng: Joi.number().optional()
    }).optional()
  }).optional(),
  tags: Joi.array().items(Joi.string().max(50)).optional(),
  isPublic: Joi.boolean().optional()
});

// Create new comparison
router.post('/', async (req, res) => {
  try {
    const { error, value } = comparisonSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Validate weights add up to 100
    const totalWeight = Object.values(value.weights).reduce((sum, weight) => sum + weight, 0);
    if (Math.abs(totalWeight - 100) > 0.1) {
      return res.status(400).json({ error: 'Weights must add up to 100%' });
    }

    // Create comparison
    const comparison = new Comparison({
      userId: req.user.userId,
      ...value
    });

    // Calculate final scores and winner
    comparison.calculateFinalScores();
    
    await comparison.save();

    // Update user's comparison count
    const User = require('../models/User');
    await User.findByIdAndUpdate(req.user.userId, {
      $inc: { 'stats.totalComparisons': 1 }
    });

    res.status(201).json({
      message: 'Comparison created successfully',
      comparison: comparison.summary
    });

  } catch (error) {
    console.error('Create comparison error:', error);
    res.status(500).json({ error: 'Failed to create comparison' });
  }
});

// Get user's comparisons
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      sort = 'createdAt', 
      order = 'desc',
      search,
      tags,
      isPublic
    } = req.query;

    const skip = (page - 1) * limit;
    const sortOrder = order === 'desc' ? -1 : 1;

    // Build query
    const query = { userId: req.user.userId };
    
    if (search) {
      query.$or = [
        { 'dish1.name': { $regex: search, $options: 'i' } },
        { 'dish2.name': { $regex: search, $options: 'i' } }
      ];
    }

    if (tags && tags.length > 0) {
      query.tags = { $in: tags };
    }

    if (isPublic !== undefined) {
      query.isPublic = isPublic === 'true';
    }

    // Get comparisons
    const comparisons = await Comparison.find(query)
      .sort({ [sort]: sortOrder })
      .limit(parseInt(limit))
      .skip(skip)
      .select('-__v');

    const totalComparisons = await Comparison.countDocuments(query);

    res.json({
      comparisons,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalComparisons / limit),
        totalComparisons,
        hasNext: skip + comparisons.length < totalComparisons,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Get comparisons error:', error);
    res.status(500).json({ error: 'Failed to get comparisons' });
  }
});

// Get specific comparison
router.get('/:id', async (req, res) => {
  try {
    const comparison = await Comparison.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!comparison) {
      return res.status(404).json({ error: 'Comparison not found' });
    }

    res.json({ comparison });

  } catch (error) {
    console.error('Get comparison error:', error);
    res.status(500).json({ error: 'Failed to get comparison' });
  }
});

// Update comparison
router.put('/:id', async (req, res) => {
  try {
    const { error, value } = comparisonSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const comparison = await Comparison.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!comparison) {
      return res.status(404).json({ error: 'Comparison not found' });
    }

    // Update comparison
    Object.assign(comparison, value);
    comparison.calculateFinalScores();
    await comparison.save();

    res.json({
      message: 'Comparison updated successfully',
      comparison: comparison.summary
    });

  } catch (error) {
    console.error('Update comparison error:', error);
    res.status(500).json({ error: 'Failed to update comparison' });
  }
});

// Delete comparison
router.delete('/:id', async (req, res) => {
  try {
    const comparison = await Comparison.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!comparison) {
      return res.status(404).json({ error: 'Comparison not found' });
    }

    // Update user's comparison count
    const User = require('../models/User');
    await User.findByIdAndUpdate(req.user.userId, {
      $inc: { 'stats.totalComparisons': -1 }
    });

    res.json({ message: 'Comparison deleted successfully' });

  } catch (error) {
    console.error('Delete comparison error:', error);
    res.status(500).json({ error: 'Failed to delete comparison' });
  }
});

// Get comparison statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const stats = await Comparison.getUserStats(req.user.userId);
    
    res.json({
      stats: stats[0] || {
        totalComparisons: 0,
        favoriteDish: null,
        avgScore: 0,
        mostUsedWeights: {
          taste: 30,
          presentation: 20,
          texture: 25,
          aroma: 15,
          value: 10
        }
      }
    });

  } catch (error) {
    console.error('Get comparison stats error:', error);
    res.status(500).json({ error: 'Failed to get comparison statistics' });
  }
});

// Get popular dishes (public comparisons)
router.get('/public/popular', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const popularDishes = await Comparison.getPopularDishes(parseInt(limit));
    
    res.json({ popularDishes });

  } catch (error) {
    console.error('Get popular dishes error:', error);
    res.status(500).json({ error: 'Failed to get popular dishes' });
  }
});

// Export comparisons
router.get('/export/data', async (req, res) => {
  try {
    const { format = 'json' } = req.query;
    
    const comparisons = await Comparison.find({ userId: req.user.userId })
      .sort({ createdAt: -1 })
      .select('-__v');

    if (format === 'csv') {
      // Convert to CSV format
      const csvData = [
        ['Date', 'Dish 1', 'Dish 2', 'Winner', 'Dish 1 Score', 'Dish 2 Score'],
        ...comparisons.map(comp => [
          comp.createdAt.toISOString().split('T')[0],
          comp.dish1.name,
          comp.dish2.name,
          comp.winner.dish,
          comp.dish1.finalScore,
          comp.dish2.finalScore
        ])
      ].map(row => row.join(',')).join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="dish-comparisons.csv"');
      res.send(csvData);
    } else {
      // JSON format
      res.json({ comparisons });
    }

  } catch (error) {
    console.error('Export comparisons error:', error);
    res.status(500).json({ error: 'Failed to export comparisons' });
  }
});

module.exports = router;
