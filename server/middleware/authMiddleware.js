// server/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
require('dotenv').config();

// This middleware checks for a valid JWT in the Authorization header
const authenticateToken = (req, res, next) => {
  // Check the standard location for tokens: "Bearer TOKEN"
  const authHeader = req.headers['authorization'];
  
  // Split the header and take the token part
  const token = authHeader && authHeader.split(' ')[1]; 

  if (token == null) {
    // 401 Unauthorized: Token is missing
    return res.status(401).json({ message: 'Authentication token required.' });
  }

  // Verify the token using our secret key
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      // 403 Forbidden: Token is invalid or expired
      return res.status(403).json({ message: 'Invalid or expired token.' });
    }
    
    // Attach the decoded user payload (id, username) to the request object
    // This makes the user's ID available to all subsequent route handlers!
    req.user = user; 
    next(); // Proceed to the next middleware or route handler
  });
};

module.exports = authenticateToken;