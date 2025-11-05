// client/src/app/page.js
"use client";

import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // <-- NEW: Import for redirecting
import axios from 'axios'; // <-- NEW: Import for making the DELETE API call

export default function Home() {
  // <-- NEW: Destructure 'token' for the protected DELETE request
  const { isAuthenticated, user, token, logout } = useAuth(); 
  const router = useRouter(); 

  // --- NEW FUNCTION: Handle Account Deletion ---
  const handleDeleteAccount = async () => {
    if (!window.confirm("WARNING: Are you absolutely sure you want to delete your account? This action is irreversible and will delete all your recipes.")) {
      return;
    }

    const config = {
      headers: { Authorization: `Bearer ${token}` } // Attach the JWT token
    };

    try {
      // Send DELETE request to the new protected endpoint
      await axios.delete('/api/auth/delete', config);
      
      // Log out and redirect after successful deletion
      logout(); 
      router.push('/');
      alert("Your account and all associated recipes have been successfully deleted.");

    } catch (error) {
      console.error('Account deletion failed:', error);
      alert('Failed to delete account. Please ensure you are logged in and try again.');
    }
  };


  if (isAuthenticated) {
    return (
      <div className="text-center my-5">
        <h1>Welcome back, {user.username}!</h1>
        <p className="lead">You are successfully logged in. You can now view and create recipes.</p>
        
        <div className="d-flex justify-content-center gap-3 mt-4">
          
          <Link href="/recipes/create" className="btn btn-primary">
             Create New Recipe
          </Link>
          
          <button className="btn btn-outline-danger" onClick={logout}>
            Log Out
          </button>
          
          {/* <-- NEW BUTTON: Delete Account --> */}
          <button className="btn btn-danger" onClick={handleDeleteAccount}>
            Delete Account
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center my-5">
      <h1>Recipe Finder Dashboard</h1>
      <p className="lead">Please log in or register to manage your recipes.</p>
      
      <div className="d-flex justify-content-center gap-3 mt-4">
        
        <Link href="/login" className="btn btn-success">
          Log In
        </Link>
        
        <Link href="/register" className="btn btn-outline-secondary">
          Register
        </Link>
      </div>
    </div>
  );
}