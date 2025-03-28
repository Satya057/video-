const jwt = require('jsonwebtoken');

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  // Get the token from Authorization header
  const token = req.headers['authorization']?.split(' ')[1]; // 'Bearer <token>'
  console.log(token)

  if (!token) {
    return res.status(401).json({ message: 'No token provided, authorization denied.' });
  }

  // Verify the token
  jwt.verify(token, 'suraj@321', (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Token is not valid' });
    }

    // Attach the decoded user information to the request object
    req.user = decoded; // Assuming the JWT contains userId in the payload
    next(); // Proceed to the next middleware or route handler
  });
};

module.exports = {verifyToken};