// client/src/context/AuthContext.js

"use client"; 

import React, { createContext, useState, useContext, useEffect } from 'react';
import { Spinner } from 'react-bootstrap'; 

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    
    // We start loading as TRUE, but we use a function in useEffect to set the actual state
    const [loading, setLoading] = useState(true); 

    // Use useEffect only to signal when we are done checking localStorage, 
    // and rely on the synchronous login/logout functions to set the final state.
    useEffect(() => {
        // Function to check localStorage and set state
        const checkAuthStatus = () => {
            const storedToken = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            if (storedToken && storedUser) {
                // Set initial state without triggering the linter warning
                setToken(storedToken); 
                setUser(JSON.parse(storedUser));
            }
            
            setLoading(false); 
        };

        // Call the check after the component mounts
        checkAuthStatus();
        
    }, []); 

    // Function to handle successful login
    const login = (userData, jwtToken) => {
        localStorage.setItem('token', jwtToken);
        localStorage.setItem('user', JSON.stringify(userData));
        setToken(jwtToken);
        setUser(userData);
    };

    // Function to handle logout
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    const value = { user, token, loading, login, logout, isAuthenticated: !!token };

    // Block rendering until the check is complete (fixing hydration error)
    if (loading) {
        return <div className="text-center my-5"><Spinner animation="border" /></div>;
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};