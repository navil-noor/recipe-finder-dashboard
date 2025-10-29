// server/index.js

const express = require('express');
const authController = require('./controllers/authController');
const recipeController = require('./controllers/recipeController'); // <-- NEW
const authenticateToken = require('./middleware/authMiddleware'); // <-- NEW

// Load environment variables from .env file
require('dotenv').config(); 

const app = express();
const port = 5000;

// MIDDLEWARE
app.use(express.json());

// ------------------------------------
// PUBLIC AUTHENTICATION ROUTES
// ------------------------------------
app.post('/auth/register', authController.register);
app.post('/auth/login', authController.login);


// ------------------------------------
// PUBLIC RECIPE READ ROUTE
// ------------------------------------
// Anyone can view the list of recipes
app.get('/recipes', recipeController.getAllRecipes);


// ------------------------------------
// PROTECTED RECIPE ROUTES (Requires Authentication)
// ------------------------------------
// Notice the 'authenticateToken' middleware is inserted here!
app.post('/recipes', authenticateToken, recipeController.createRecipe);
app.put('/recipes/:id', authenticateToken, recipeController.updateRecipe);
app.delete('/recipes/:id', authenticateToken, recipeController.deleteRecipe);


// ------------------------------------
// Server Start
// ------------------------------------
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});