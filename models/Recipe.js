const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Recipe name is required']
  },
  description: {
    type: String,
    required: [true, 'Recipe description is required']
  },
  price: {
    type: Number,
    required: [true, 'Recipe price is required']
  },
  imagePath: String,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required']
  },
  tag: {
    type: String,
    enum: ['Breakfast', 'Lunch', 'Dinner', 'Dessert'],
    required: [true, 'Tag is required']
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Recipe', recipeSchema); 