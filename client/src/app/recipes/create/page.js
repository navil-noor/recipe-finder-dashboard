// client/src/app/recipes/create/page.js
"use client";
import RecipeForm from '../../../components/RecipeForm';
import { useAuth } from '../../../context/AuthContext';
import { Alert } from 'react-bootstrap';

export default function CreateRecipePage() {
  const { isAuthenticated } = useAuth();

  // Protection: Only show the form if authenticated
  if (!isAuthenticated) {
    return (
      <Alert variant="danger" className="text-center mt-5">
        You must be logged in to create a recipe.
      </Alert>
    );
  }

  return <RecipeForm />;
}