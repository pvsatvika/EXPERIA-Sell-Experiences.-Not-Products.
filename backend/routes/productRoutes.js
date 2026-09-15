const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// @route   GET /api/products
// @desc    Get all experiences
// @access  Public
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({ available: true }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch experiences',
      error: error.message
    });
  }
});

// @route   GET /api/products/:id
// @desc    Get single experience by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Experience not found'
      });
    }
    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    // Invalid MongoDB ObjectId error check
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Experience not found (Invalid ID format)'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
});

module.exports = router;
