// client/src/components/RecipeList.js
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Spinner, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import RecipeItem from './RecipeItem'; 

export default function RecipeList() {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const { isAuthenticated } = useAuth(); 

    const fetchRecipes = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Public GET request to fetch all recipes (from server/index.js: app.get('/recipes', ...))
            const response = await axios.get('/api/recipes');
            setRecipes(response.data);
        } catch (err) {
            console.error("Error fetching recipes:", err);
            // Show a user-friendly error if the server is down or broken
            setError("Failed to fetch recipes. Check the Express server console for details.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRecipes();
    }, [fetchRecipes]);

    if (loading) {
        return <div className="text-center my-5"><Spinner animation="border" /></div>;
    }

    if (error) {
        return <Alert variant="danger" className="text-center mt-4">{error}</Alert>;
    }

    return (
        <div className="mt-5">
            <h2 className="mb-4 text-center">All Community Recipes</h2>
            <div className="d-flex flex-wrap justify-content-center gap-4">
                {recipes.length === 0 ? (
                    <Alert variant="info" className="text-center w-100">
                        No recipes found. {isAuthenticated ? "Be the first to create one!" : "Log in to add a recipe."}
                    </Alert>
                ) : (
                    recipes.map((recipe) => (
                        <RecipeItem 
                            key={recipe.id} 
                            recipe={recipe} 
                            onRecipeAction={fetchRecipes} // Pass refetch function for CRUD actions
                        />
                    ))
                )}
            </div>
        </div>
    );
}