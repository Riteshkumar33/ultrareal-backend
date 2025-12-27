import jwt from 'jsonwebtoken';
import member from '../models/member.js';
import admin from '../models/admin.js';
import manager from '../models/manager.js';
import manufacturer from '../models/manufacturer.js';
import supplier from '../models/supplier.js';
import retailer from '../models/retailer.js';


const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let user;
    
    // Check role and fetch from appropriate collection
    if (decoded.role === 'member') {
      user = await member.findById(decoded.id);
    } else if (decoded.role === 'admin') {
      user = await admin.findById(decoded.id);
    } else if (decoded.role === 'manufacturer') {
      user = await manufacturer.findById(decoded.id);
    }else if (decoded.role === 'supplier') {
      user = await supplier.findById(decoded.id);
    } else if (decoded.role === 'retailer') {
      user = await retailer.findById(decoded.id);
    }
    else if (decoded.role === 'manager') {
      user = await manager.findById(decoded.id);
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
};

export { protect };