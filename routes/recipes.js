const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');
const auth = require('../middlewares/auth');
const multer = require('multer');

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Create recipe
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const recipe = new Recipe({
      ...req.body,
      imagePath: req.file ? req.file.path : undefined,
      createdBy: req.user.id
    });
    await recipe.save();
    res.status(201).json(recipe);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all recipes
router.get('/', auth, async (req, res) => {
  try {
    const { name, tag, category, pageSize = 10, pageNumber = 1 } = req.query;
    const query = {};
    
    if (name) query.name = new RegExp(name, 'i');
    if (tag) query.tag = tag;
    if (category) query.category = category;

    const recipes = await Recipe.find(query)
      .populate('category')
      .populate('createdBy', '-password')
      .skip((pageNumber - 1) * pageSize)
      .limit(parseInt(pageSize));

    const total = await Recipe.countDocuments(query);

    res.json({
      data: recipes,
      pageSize: parseInt(pageSize),
      pageNumber: parseInt(pageNumber),
      totalNumberOfPages: Math.ceil(total / pageSize)
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get recipe by id
router.get('/:id', auth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate('category')
      .populate('createdBy', '-password');
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.json(recipe);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update recipe
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    
    if (recipe.createdBy.toString() !== req.user.id && req.user.userGroup !== 'SuperAdmin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updates = {
      ...req.body,
      imagePath: req.file ? req.file.path : recipe.imagePath
    };

    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );
    res.json(updatedRecipe);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete recipe
router.delete('/:id', auth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    if (recipe.createdBy.toString() !== req.user.id && req.user.userGroup !== 'SuperAdmin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await recipe.remove();
    res.json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 