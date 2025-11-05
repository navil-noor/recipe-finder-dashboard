// client/src/app/page.js

"use client";

import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; 
import axios from 'axios'; 
import { Spinner } from 'react-bootstrap'; 

export default function Home() {
  const { isAuthenticated, user, token, logout, loading } = useAuth(); 
  const router = useRouter(); 

  // --- Handle Account Deletion Logic ---
  const handleDeleteAccount = async () => {
    if (!window.confirm("WARNING: Are you absolutely sure you want to delete your account? This action is irreversible and will delete all your recipes.")) {
      return;
    }

    const config = {
      headers: { Authorization: `Bearer ${token}` } 
    };

    try {
      await axios.delete('/api/auth/delete', config);
      logout(); 
      router.push('/');
      alert("Your account and all associated recipes have been successfully deleted.");

    } catch (error) {
      console.error('Account deletion failed:', error);
      alert('Failed to delete account. Please ensure you are logged in and try again.');
    }
  };

  // --- CRITICAL HYDRATION CHECK: Wait for AuthContext ---
  if (loading) {
    return <div className="text-center my-5"><Spinner animation="border" /></div>;
  }
  
  if (isAuthenticated) {
    // This view is only rendered when loading is false and token/user are set
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