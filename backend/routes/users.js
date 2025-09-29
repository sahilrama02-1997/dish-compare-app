const express = require('express');
const Joi = require('joi');
const User = require('../models/User');

const router = express.Router();

// Get user profile
router.get('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: user.profile });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

// Update user profile
router.put('/profile', async (req, res) => {
  try {
    const { name, preferences } = req.body;
    
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update name if provided
    if (name && name.trim().length >= 2) {
      user.name = name.trim();
    }

    // Update preferences if provided
    if (preferences) {
      if (preferences.defaultWeights) {
        user.preferences.defaultWeights = { ...user.preferences.defaultWeights, ...preferences.defaultWeights };
      }
      if (preferences.notifications) {
        user.preferences.notifications = { ...user.preferences.notifications, ...preferences.notifications };
      }
    }

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: user.profile
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Get user statistics
router.get('/stats', async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get comparison statistics
    const Comparison = require('../models/Comparison');
    const comparisonStats = await Comparison.getUserStats(req.user.userId);

    res.json({
      user: user.profile,
      stats: {
        totalComparisons: user.stats.totalComparisons,
        favoriteDish: user.stats.favoriteDish,
        lastActive: user.stats.lastActive,
        preferences: user.preferences,
        comparisonDetails: comparisonStats[0] || {
          totalComparisons: 0,
          favoriteDish: null,
          avgScore: 0,
          mostUsedWeights: user.preferences.defaultWeights
        }
      }
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to get user statistics' });
  }
});

// Update user preferences
router.put('/preferences', async (req, res) => {
  try {
    const { defaultWeights, notifications } = req.body;
    
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Validate weights if provided
    if (defaultWeights) {
      const totalWeight = Object.values(defaultWeights).reduce((sum, weight) => sum + weight, 0);
      if (Math.abs(totalWeight - 100) > 0.1) {
        return res.status(400).json({ error: 'Weights must add up to 100%' });
      }
      
      user.preferences.defaultWeights = { ...user.preferences.defaultWeights, ...defaultWeights };
    }

    // Update notifications if provided
    if (notifications) {
      user.preferences.notifications = { ...user.preferences.notifications, ...notifications };
    }

    await user.save();

    res.json({
      message: 'Preferences updated successfully',
      preferences: user.preferences
    });

  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({ error: 'Failed to update preferences' });
  }
});

// Delete user account
router.delete('/account', async (req, res) => {
  try {
    const { confirmDelete } = req.body;
    
    if (confirmDelete !== 'DELETE') {
      return res.status(400).json({ error: 'Please confirm deletion by typing "DELETE"' });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Soft delete - mark as inactive
    user.isActive = false;
    await user.save();

    // TODO: Delete user's comparisons if needed
    // const Comparison = require('../models/Comparison');
    // await Comparison.deleteMany({ userId: req.user.userId });

    res.json({ message: 'Account deleted successfully' });

  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ error: 'Failed to delete account' });
  }
});

// Get user's recent activity
router.get('/activity', async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    
    const Comparison = require('../models/Comparison');
    const skip = (page - 1) * limit;

    const comparisons = await Comparison.find({ userId: req.user.userId })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .select('dish1.name dish2.name winner createdAt');

    const totalComparisons = await Comparison.countDocuments({ userId: req.user.userId });

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
    console.error('Get activity error:', error);
    res.status(500).json({ error: 'Failed to get user activity' });
  }
});

module.exports = router;
