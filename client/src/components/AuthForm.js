// client/src/components/AuthForm.js

import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation'; // Use next/navigation for client-side routing

export default function AuthForm({ type }) { // 'type' will be 'login' or 'register'
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const router = useRouter();

  const isRegister = type === 'register';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
    
    // Build payload based on form type
    const payload = {
        email,
        password,
        ...(isRegister && { username }), // Conditionally add username for registration
    };

    try {
        const response = await axios.post(endpoint, payload);
        
        // Use the login function from AuthContext to set global state and local storage
        login(response.data.user, response.data.token); 
        
        // Redirect to the main page after successful login/registration
        router.push('/');

    } catch (err) {
        console.error('Auth Error:', err);
        // Display user-friendly error from backend or a default message
        setError(err.response?.data?.message || `Failed to ${type}. Please try again.`);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="my-5" style={{ maxWidth: '400px', margin: '0 auto' }}>
      <h2>{isRegister ? 'Register' : 'Login'}</h2>
      <hr />

      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        
        {isRegister && (
          <Form.Group className="mb-3" controlId="formUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" placeholder="Enter username" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </Form.Group>
        )}

        <Form.Group className="mb-3" controlId="formEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </Form.Group>

        <Button variant="success" type="submit" disabled={loading}>
          {loading ? 'Processing...' : (isRegister ? 'Sign Up' : 'Log In')}
        </Button>
      </Form>
    </div>
  );
}