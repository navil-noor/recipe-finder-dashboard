// client/src/context/AuthContext.js

"use client"; 

import React, { createContext, useState, useContext } from 'react';

// 1. Create the Context object
const AuthContext = createContext(null);

// 2. Custom hook for easy access to context values
export const useAuth = () => useContext(AuthContext);

// 3. Provider component that holds the state
export const AuthProvider = ({ children }) => {
    
    // Initial State Functions: Reads from localStorage ONCE during the initial render.
    const [token, setToken] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('token');
        }
        return null;
    });

    const [user, setUser] = useState(() => {
        if (typeof window !== 'undefined') {
            const storedUser = localStorage.getItem('user');
            return storedUser ? JSON.parse(storedUser) : null;
        }
        return null;
    });

    // The 'loading' state is now a constant since we load synchronously
    const loading = false; 

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

    // The value provided to components that consume the context
    const value = {
        user,
        token,
        loading, // This is now always false
        login,
        logout,
        isAuthenticated: !!token 
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};