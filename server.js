const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const userRoutes = require('./routes/users');
const recipeRoutes = require('./routes/recipes');
const categoryRoutes = require('./routes/categories');
const tagRoutes = require('./routes/tags');
const userRecipeRoutes = require('./routes/userRecipes');

app.use('/api/v1/Users', userRoutes);
app.use('/api/v1/Recipe', recipeRoutes);
app.use('/api/v1/Category', categoryRoutes);
app.use('/api/v1/tag', tagRoutes);
app.use('/api/v1/userRecipe', userRecipeRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB:', err));

// Start server
const port = process.env.PORT || 3006;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 