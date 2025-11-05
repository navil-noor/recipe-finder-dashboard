// client/src/components/RecipeForm.js
"use client";

import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function RecipeForm() {
    const [title, setTitle] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [instructions, setInstructions] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const { token } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const config = {
            headers: { Authorization: `Bearer ${token}` } // Attach the token!
        };

        const payload = { title, ingredients, instructions };

        try {
            await axios.post('/api/recipes', payload, config);
            
            // Success: Redirect back to the home page to see the new recipe
            router.push('/');
        } catch (err) {
            console.error('Creation Error:', err);
            // Display error, especially if unauthorized (401/403)
            setError(err.response?.data?.message || 'Failed to create recipe. Are you logged in?');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="my-5" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2>Create New Recipe</h2>
            <hr />

            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formTitle">
                    <Form.Label>Recipe Title</Form.Label>
                    <Form.Control type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formIngredients">
                    <Form.Label>Ingredients (one per line)</Form.Label>
                    <Form.Control as="textarea" rows={5} value={ingredients} onChange={(e) => setIngredients(e.target.value)} required />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formInstructions">
                    <Form.Label>Instructions</Form.Label>
                    <Form.Control as="textarea" rows={8} value={instructions} onChange={(e) => setInstructions(e.target.value)} required />
                </Form.Group>

                <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? 'Submitting...' : 'Save Recipe'}
                </Button>
                <Button variant="secondary" onClick={() => router.push('/')} className="ms-3">
                    Cancel
                </Button>
            </Form>
        </div>
    );
}