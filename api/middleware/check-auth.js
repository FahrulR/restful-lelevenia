const jwt = require('jsonwebtoken'); 

module.exports = (req, res, next) => {
  try {
    const token = req.body.user_jwt;
    console.log(token);
    const decoded = jwt.verify(token, process.env.JWT_KEY || 'secret');
    req.userData = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: 'auth failed'
    });
  }
};