// server/controllers/authController.js

const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Load environment variables (especially JWT_SECRET)
require('dotenv').config(); 

// 1. User Registration (Sign Up)
exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  // Basic validation
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    // Check if user already exists
    const existingUser = await db('users').where({ email }).orWhere({ username }).first();
    if (existingUser) {
      return res.status(409).json({ message: 'Username or email already in use.' });
    }

    // Security: Hash the password before saving it
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Save the new user to the database
    const [id] = await db('users').insert({ 
      username, 
      email, 
      password_hash 
    });

    // Generate JWT token for immediate login
    const token = jwt.sign({ id, username }, process.env.JWT_SECRET, { expiresIn: '1d' });

    // Send token and user info back (excluding the hash)
    res.status(201).json({ 
      message: 'User registered successfully!', 
      token, 
      user: { id, username, email }
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: 'Server error during registration.' });
  }
};

// 2. User Login (Sign In)
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    // 1. Retrieve user by email
    const user = await db('users').where({ email }).first();
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // 2. Compare the plain password with the stored hash
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // 3. Generate a fresh JWT token for session management
    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1d' });

    // 4. Send the token back to the client
    res.status(200).json({ 
      message: 'Login successful!', 
      token, 
      user: { id: user.id, username: user.username, email: user.email }
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
};

// 3. User Deletion (Protected Route)
exports.deleteUser = async (req, res) => { // <-- NOTE the 'exports.'
  // The user ID comes from the authenticated token
  const user_id = req.user.id; 

  try {
    const rowsDeleted = await db('users').where({ id: user_id }).del();

    if (rowsDeleted === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(204).send(); // 204 No Content for success
  } catch (error) {
    console.error('User deletion error:', error); // <-- CHECK YOUR SERVER CONSOLE!
    res.status(500).json({ message: 'Failed to delete user.' });
  }
};