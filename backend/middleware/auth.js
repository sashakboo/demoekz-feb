const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ msg: 'No token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || '1');    
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ msg: 'Token is not valid' });
    }
    
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

const adminAuth = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ msg: 'No token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || '1');
  
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ msg: 'Token is not valid' });
    }
    
    if (user.login !== 'adminka') {
      return res.status(403).json({ msg: 'Access denied. Admin rights required.' });
    }
    
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = { auth, adminAuth };