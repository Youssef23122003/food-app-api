const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const auth = require('../middlewares/auth');

// Create category (admin only)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.userGroup !== 'SuperAdmin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const category = new Category(req.body);
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all categories
router.get('/', auth, async (req, res) => {
  try {
    const { pageSize = 10, pageNumber = 1 } = req.query;
    const categories = await Category.find()
      .skip((pageNumber - 1) * pageSize)
      .limit(parseInt(pageSize));

    const total = await Category.countDocuments();

    res.json({
      data: categories,
      pageSize: parseInt(pageSize),
      pageNumber: parseInt(pageNumber),
      totalNumberOfPages: Math.ceil(total / pageSize)
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get category by id
router.get('/:id', auth, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update category (admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.userGroup !== 'SuperAdmin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete category (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.userGroup !== 'SuperAdmin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 