// server/controllers/recipeController.js

const db = require('../db');

// --- 1. GET: Fetch All Recipes (Public Route) ---
exports.getAllRecipes = async (req, res) => {
  try {
    // Fetch all recipes and join with users to get the author's username
    const recipes = await db('recipes')
      .select('recipes.*', 'users.username as author')
      .join('users', 'recipes.user_id', 'users.id')
      .orderBy('recipes.created_at', 'desc');

    res.json(recipes);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ message: 'Failed to retrieve recipes.' });
  }
};


// --- 2. POST: Create New Recipe (Protected Route) ---
exports.createRecipe = async (req, res) => {
  const { title, ingredients, instructions } = req.body;
  // The user ID comes from the authenticated token!
  const user_id = req.user.id; 

  if (!title || !ingredients || !instructions) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const [id] = await db('recipes').insert({ 
      title, 
      ingredients, 
      instructions, 
      user_id 
    });

    const newRecipe = await db('recipes').where({ id }).first();
    res.status(201).json(newRecipe);
  } catch (error) {
    console.error('Error creating recipe:', error);
    res.status(500).json({ message: 'Failed to create recipe.' });
  }
};


// --- 3. PUT: Update Recipe (Protected Route - Owner Only) ---
exports.updateRecipe = async (req, res) => {
  const recipeId = req.params.id;
  const updates = req.body;
  const user_id = req.user.id; // User ID of the person making the request

  try {
    const existingRecipe = await db('recipes').where({ id: recipeId }).first();

    if (!existingRecipe) {
      return res.status(404).json({ message: 'Recipe not found.' });
    }

    // Authorization Check: Does the user own this recipe?
    if (existingRecipe.user_id !== user_id) {
      return res.status(403).json({ message: 'Forbidden: You do not own this recipe.' });
    }

    // Perform the update
    await db('recipes').where({ id: recipeId }).update(updates);
    const updatedRecipe = await db('recipes').where({ id: recipeId }).first();

    res.json(updatedRecipe);
  } catch (error) {
    console.error(`Error updating recipe ${recipeId}:`, error);
    res.status(500).json({ message: 'Failed to update recipe.' });
  }
};


// --- 4. DELETE: Delete Recipe (Protected Route - Owner Only) ---
exports.deleteRecipe = async (req, res) => {
  const recipeId = req.params.id;
  const user_id = req.user.id; // User ID of the person making the request

  try {
    const existingRecipe = await db('recipes').where({ id: recipeId }).first();

    if (!existingRecipe) {
      return res.status(404).json({ message: 'Recipe not found.' });
    }

    // Authorization Check: Does the user own this recipe?
    if (existingRecipe.user_id !== user_id) {
      return res.status(403).json({ message: 'Forbidden: You do not own this recipe.' });
    }

    // Perform the deletion
    await db('recipes').where({ id: recipeId }).del();
    
    res.status(204).send(); // 204 No Content for successful deletion
  } catch (error) {
    console.error(`Error deleting recipe ${recipeId}:`, error);
    res.status(500).json({ message: 'Failed to delete recipe.' });
  }
};