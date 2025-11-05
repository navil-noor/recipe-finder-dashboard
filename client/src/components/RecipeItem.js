// client/src/components/RecipeItem.js
"use client";

import React, { useState } from 'react';
import axios from 'axios';
import { Card, Button, Modal } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

export default function RecipeItem({ recipe, onRecipeAction }) {
    const { user, token, isAuthenticated } = useAuth();
    // Check if the currently logged-in user is the owner of this recipe
    const isOwner = isAuthenticated && user && user.id === recipe.user_id; 
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    // Use the title from the recipe prop for initial state
    const [updatedTitle, setUpdatedTitle] = useState(recipe.title); 

    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    
    // --- DELETE Logic ---
    const handleDelete = async () => {
        if (!window.confirm(`Are you sure you want to delete "${recipe.title}"?`)) {
            return;
        }
        try {
            await axios.delete(`/api/recipes/${recipe.id}`, config);
            onRecipeAction(); // Refresh the list
        } catch (error) {
            console.error('Delete error:', error);
            alert('Failed to delete recipe. Check ownership and login status.');
        }
    };
    
    // --- UPDATE Logic (Simplified to just title) ---
    const handleUpdate = async (e) => {
        e.preventDefault();
        if (updatedTitle === recipe.title || !updatedTitle.trim()) {
            setIsEditing(false);
            return;
        }
        
        try {
            // Send PUT request with the updated title
            await axios.put(`/api/recipes/${recipe.id}`, { title: updatedTitle }, config);
            setIsEditing(false);
            onRecipeAction(); // Refresh the list
        } catch (error) {
            console.error('Update error:', error);
            alert('Failed to update recipe. Check ownership and login status.');
        }
    };


    return (
        <Card style={{ width: '18rem' }} className="shadow-sm">
            <Card.Body>
                {/* Conditional Title Rendering */}
                {isEditing ? (
                    <form onSubmit={handleUpdate}>
                        <input 
                            type="text" 
                            value={updatedTitle} 
                            onChange={(e) => setUpdatedTitle(e.target.value)} 
                            className="form-control mb-2"
                            required
                        />
                        <Button variant="success" size="sm" type="submit" className="me-2">Save</Button>
                        <Button variant="secondary" size="sm" onClick={() => setIsEditing(false)}>Cancel</Button>
                    </form>
                ) : (
                    <Card.Title onClick={() => setShowModal(true)} style={{ cursor: 'pointer' }}>
                        {recipe.title}
                    </Card.Title>
                )}
                
                {/* CRITICAL: Must reference 'recipe.author' property */}
                <Card.Subtitle className="mb-2 text-muted">
                    By: **{recipe.author}**
                </Card.Subtitle>

                <Button variant="info" size="sm" onClick={() => setShowModal(true)} className="me-2 mt-2">View Details</Button>

                {/* Owner Actions */}
                {isOwner && !isEditing && (
                    <>
                        <Button variant="warning" size="sm" onClick={() => setIsEditing(true)} className="me-2 mt-2">Edit</Button>
                        <Button variant="danger" size="sm" onClick={handleDelete} className="mt-2">Delete</Button>
                    </>
                )}
            </Card.Body>
            
            {/* Details Modal (using recipe details) */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{recipe.title} <small className="text-muted fs-6">by {recipe.author}</small></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h5>Ingredients</h5>
                    <p style={{ whiteSpace: 'pre-line' }}>{recipe.ingredients}</p>
                    <h5>Instructions</h5>
                    <p style={{ whiteSpace: 'pre-line' }}>{recipe.instructions}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
                </Modal.Footer>
            </Modal>
        </Card>
    );
}