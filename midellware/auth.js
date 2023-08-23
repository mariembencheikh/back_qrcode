const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization'); 
     if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  try {
    
    const decoded = jwt.verify(token.split(' ')[1], 'secretkey');
        console.log('Decoded token:', decoded); // Log the decoded token
    req.user = decoded.userId;
    next();
 
  } catch (error) {
    res.status(401).json(error);
  }
};

module.exports = authMiddleware;
