const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.header('x-auth-token'); 
     if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  console.log("auth token",token);
  try {
    
    const decoded = jwt.verify(token, 'secretkey'); 
    console.log('Decoded token:', decoded); // Log the decoded token
    req.user = decoded.userId;
    next();
    console.log('req.user:', req.user);
            console.log('token:', token);
  } catch (error) {
    res.status(401).json(error);
  }
};

module.exports = authMiddleware;
