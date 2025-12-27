// routes/authRoutes.js
import express from 'express';
const router = express.Router();
import {
  registerManufacturer,
  registerAdmin,
  registerSupplier,
  registerRetailer,
  registerManager,
  registerUser,
  login,
  verifyOTP,
  resendOTP,
  getMe,
} from '../controllers/authController.js';

import { protect } from '../midleware/auth.js';
import { authorize } from '../midleware/roleCheck.js';

// ==================== PUBLIC ROUTES ====================

// Registration Routes
router.post('/register-manufacturer', registerManufacturer);
router.post('/register-admin', registerAdmin);
router.post('/register-supplier', registerSupplier);
router.post('/register-retailer', registerRetailer);
router.post('/register-manager', registerManager);
router.post('/register-user', registerUser);

// Authentication Routes with OTP
router.post('/login', login);           // Step 1: Send OTP
router.post('/verify-otp', verifyOTP);  // Step 2: Verify OTP and get token
router.post('/resend-otp', resendOTP);  // Resend OTP

// ==================== PROTECTED ROUTES ====================

// Get logged-in user info
router.get('/me', protect, getMe);

// ==================== ROLE-BASED DASHBOARD ROUTES ====================

// Admin Dashboard
router.get('/admin-dashboard', protect, authorize('admin'), (req, res) => {
  res.json({ 
    success: true, 
    message: 'Welcome to Admin Dashboard',
    user: req.user 
  });
});

// Manufacturer Dashboard
router.get('/manufacturer-dashboard', protect, authorize('manufacturer'), (req, res) => {
  res.json({ 
    success: true, 
    message: 'Welcome to Manufacturer Dashboard',
    user: req.user 
  });
});

// Supplier Dashboard
router.get('/supplier-dashboard', protect, authorize('supplier'), (req, res) => {
  res.json({ 
    success: true, 
    message: 'Welcome to Supplier Dashboard',
    user: req.user 
  });
});

// Retailer Dashboard
router.get('/retailer-dashboard', protect, authorize('retailer'), (req, res) => {
  res.json({ 
    success: true, 
    message: 'Welcome to Retailer Dashboard',
    user: req.user 
  });
});

// Manager Dashboard
router.get('/manager-dashboard', protect, authorize('manager'), (req, res) => {
  res.json({ 
    success: true, 
    message: 'Welcome to Manager Dashboard',
    user: req.user 
  });
});

// Member Dashboard
router.get('/user-dashboard', protect, authorize('member'), (req, res) => {
  res.json({ 
    success: true, 
    message: 'Welcome to User Dashboard',
    user: req.user 
  });
});

// ==================== MULTI-ROLE ACCESS ROUTES ====================

// Profile accessible by manufacturer, supplier, retailer, manager
router.get('/profile', protect, authorize('manufacturer', 'supplier', 'retailer', 'manager'), (req, res) => {
  res.json({ 
    success: true, 
    message: 'Profile Page',
    user: req.user 
  });
});

// Admin & Manager can manage accounts
router.get('/manage-accounts', protect, authorize('admin', 'manager'), (req, res) => {
  res.json({ 
    success: true, 
    message: 'Manage Accounts Page',
    user: req.user 
  });
});

export default router;
