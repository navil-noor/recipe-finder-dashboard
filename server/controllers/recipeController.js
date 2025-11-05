// server/controllers/recipeController.js
const db = require('../db'); 

// 1. Get All Recipes (Public Read)
exports.getAllRecipes = async (req, res) => {
    try {
        const recipes = await db('recipes')
            // Join with users table to get the author's username
            .join('users', 'recipes.user_id', '=', 'users.id')
            .select(
                'recipes.id',
                'recipes.title',
                'recipes.ingredients',
                'recipes.instructions',
                'recipes.user_id', // For client-side ownership check
                'users.username as author' // CRITICAL: Aliased for client component
            )
            .orderBy('recipes.id', 'desc');

        res.status(200).json(recipes);
    } catch (error) {
        console.error('Error fetching recipes:', error);
        res.status(500).json({ message: 'Failed to fetch recipes.' });
    }
};

// 2. Create Recipe (Protected Write)
exports.createRecipe = async (req, res) => {
    const { title, ingredients, instructions } = req.body;
    // The user ID is retrieved from the JWT token via middleware
    const user_id = req.user.id; 

    if (!title || !ingredients || !instructions) {
        return res.status(400).json({ message: 'All recipe fields are required.' });
    }

    try {
        const [id] = await db('recipes').insert({
            title,
            ingredients,
            instructions,
            user_id
        }).returning('id');
        
        res.status(201).json({ id, title, message: 'Recipe created successfully.' });
    } catch (error) {
        console.error('Recipe creation error:', error);
        res.status(500).json({ message: 'Failed to create recipe.' });
    }
};

// 3. Update Recipe (Protected Write - Ownership required)
exports.updateRecipe = async (req, res) => {
    const { id } = req.params;
    const { title, ingredients, instructions } = req.body;
    const user_id = req.user.id; 
    
    // Only allow update of specific fields provided in the body
    const updates = {};
    if (title) updates.title = title;
    if (ingredients) updates.ingredients = ingredients;
    if (instructions) updates.instructions = instructions;

    if (Object.keys(updates).length === 0) {
        return res.status(400).json({ message: 'No fields provided for update.' });
    }

    try {
        // Find the recipe and check ownership
        const recipe = await db('recipes').where({ id }).first();

        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found.' });
        }

        if (recipe.user_id !== user_id) {
            return res.status(403).json({ message: 'Forbidden: You do not own this recipe.' });
        }

        // Perform the update
        await db('recipes').where({ id }).update(updates);
        
        res.status(200).json({ message: 'Recipe updated successfully.' });

    } catch (error) {
        console.error('Recipe update error:', error);
        res.status(500).json({ message: 'Failed to update recipe.' });
    }
};

// 4. Delete Recipe (Protected Write - Ownership required)
exports.deleteRecipe = async (req, res) => {
    const { id } = req.params;
    const user_id = req.user.id; 

    try {
        // Find the recipe and check ownership
        const recipe = await db('recipes').where({ id }).first();

        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found.' });
        }

        if (recipe.user_id !== user_id) {
            return res.status(403).json({ message: 'Forbidden: You do not own this recipe.' });
        }

        // Perform the deletion
        await db('recipes').where({ id }).del();
        
        res.status(204).send(); // 204 No Content for successful deletion

    } catch (error) {
        console.error('Recipe deletion error:', error);
        res.status(500).json({ message: 'Failed to delete recipe.' });
    }
};