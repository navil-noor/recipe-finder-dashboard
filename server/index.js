// server/index.js

const express = require('express');
const authController = require('./controllers/authController');

// Load environment variables from .env file
require('dotenv').config(); 

const app = express();
const port = 5000;

// MIDDLEWARE: Required for Express to parse JSON data sent in the request body
app.use(express.json());

// ------------------------------------
// AUTHENTICATION ROUTES (The focus of this step)
// ------------------------------------
app.post('/auth/register', authController.register);
app.post('/auth/login', authController.login);


// ------------------------------------
// RECIPE ROUTES (Will be built in the next step)
// ------------------------------------
// app.get('/recipes', ... ); 
// app.post('/recipes', ... ); 


// ------------------------------------
// Server Start
// ------------------------------------
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});