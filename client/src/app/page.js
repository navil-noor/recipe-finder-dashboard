// client/src/app/page.js
"use client";

import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
// We don't need to import Button from react-bootstrap anymore, 
// as we are using Link styled directly with Bootstrap classes.

export default function Home() {
  const { isAuthenticated, user, logout } = useAuth();
  
  if (isAuthenticated) {
    return (
      <div className="text-center my-5">
        <h1>Welcome back, {user.username}!</h1>
        <p className="lead">You are successfully logged in. You can now view and create recipes.</p>
        
        <div className="d-flex justify-content-center gap-3 mt-4">
          
          {/* 1. Correct Link usage for button-style link */}
          <Link href="/recipes/create" className="btn btn-primary">
             Create New Recipe
          </Link>
          
          {/* Log Out button remains a regular button */}
          <button className="btn btn-outline-danger" onClick={logout}>
            Log Out
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
        
        {/* 2. Correct Link usage for Log In */}
        <Link href="/login" className="btn btn-success">
          Log In
        </Link>
        
        {/* 3. Correct Link usage for Register */}
        <Link href="/register" className="btn btn-outline-secondary">
          Register
        </Link>
      </div>
    </div>
  );
}