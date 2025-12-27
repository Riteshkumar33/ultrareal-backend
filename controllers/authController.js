// controllers/authController.js
import jwt from "jsonwebtoken";
import member from "../models/member.js";
import admin from "../models/admin.js";
import manager from "../models/manager.js";
import manufacturer from "../models/manufacturer.js";
import supplier from "../models/supplier.js";
import retailer from "../models/retailer.js";
import OTP from "../models/otp.js";
import { generateOTP, sendOTPEmail } from "../config/emailConfig.js";

// ==================== HELPER FUNCTIONS ====================

// Capitalize role for display
const capitalizeRole = (r) => {
  if (!r) return r;
  return r.charAt(0).toUpperCase() + r.slice(1);
};

// Generate JWT Token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// GLOBAL EMAIL CHECK TO PREVENT DUPLICATES
const emailExistsGlobally = async (email) => {
  const userMember = await member.findOne({ email });
  const userAdmin = await admin.findOne({ email });
  const userManufacturer = await manufacturer.findOne({ email });
  const userSupplier = await supplier.findOne({ email });
  const userRetailer = await retailer.findOne({ email });
  const userManager = await manager.findOne({ email });

  if (userMember || userAdmin || userManager || userManufacturer || userSupplier || userRetailer) 
    return true;
  return false;
};

// Find user in all collections
const findUserByEmail = async (email) => {
  let user;
  let role;

  user = await member.findOne({ email }).select("+password");
  if (user) return { user, role: "member" };

  user = await manufacturer.findOne({ email }).select("+password");
  if (user) return { user, role: "manufacturer" };

  user = await supplier.findOne({ email }).select("+password");
  if (user) return { user, role: "supplier" };

  user = await retailer.findOne({ email }).select("+password");
  if (user) return { user, role: "retailer" };

  user = await admin.findOne({ email }).select("+password");
  if (user) return { user, role: "admin" };

  user = await manager.findOne({ email }).select("+password");
  if (user) return { user, role: "manager" };

  return { user: null, role: null };
};

// Find user without password for OTP verification
const findUserByEmailForOTP = async (email) => {
  let user;
  let role;

  user = await member.findOne({ email });
  if (user) return { user, role: "member" };

  user = await manufacturer.findOne({ email });
  if (user) return { user, role: "manufacturer" };

  user = await supplier.findOne({ email });
  if (user) return { user, role: "supplier" };

  user = await retailer.findOne({ email });
  if (user) return { user, role: "retailer" };

  user = await admin.findOne({ email });
  if (user) return { user, role: "admin" };

  user = await manager.findOne({ email });
  if (user) return { user, role: "manager" };

  return { user: null, role: null };
};

// ==================== REGISTRATION CONTROLLERS ====================

// Register Member
export const registerUser = async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    if (await emailExistsGlobally(email)) {
      return res.status(400).json({
        success: false,
        message: "Email already exists in the system",
      });
    }

    const user = await member.create({ name, email, mobile, password });
    const token = generateToken(user._id, "member");

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: capitalizeRole(user.name),
        email: user.email,
        mobile: user.mobile,
        role: capitalizeRole("member"),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Register Manufacturer
export const registerManufacturer = async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    if (await emailExistsGlobally(email)) {
      return res.status(400).json({
        success: false,
        message: "Email already exists in the system",
      });
    }

    const user = await manufacturer.create({ name, email, mobile, password });
    const token = generateToken(user._id, "manufacturer");

    res.status(201).json({
      success: true,
      message: "Manufacturer registered successfully",
      token,
      user: {
        id: user._id,
        name: capitalizeRole(user.name),
        email: user.email,
        mobile: user.mobile,
        role: capitalizeRole("manufacturer"),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Register Retailer
export const registerRetailer = async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    if (await emailExistsGlobally(email)) {
      return res.status(400).json({
        success: false,
        message: "Email already exists in the system",
      });
    }

    const user = await retailer.create({ name, email, mobile, password });
    const token = generateToken(user._id, "retailer");

    res.status(201).json({
      success: true,
      message: "Retailer registered successfully",
      token,
      user: {
        id: user._id,
        name: capitalizeRole(user.name),
        email: user.email,
        mobile: user.mobile,
        role: capitalizeRole("retailer"),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Register Supplier
export const registerSupplier = async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    if (await emailExistsGlobally(email)) {
      return res.status(400).json({
        success: false,
        message: "Email already exists in the system",
      });
    }

    const user = await supplier.create({ name, email, mobile, password });
    const token = generateToken(user._id, "supplier");

    res.status(201).json({
      success: true,
      message: "Supplier registered successfully",
      token,
      user: {
        id: user._id,
        name: capitalizeRole(user.name),
        email: user.email,
        mobile: user.mobile,
        role: capitalizeRole("supplier"),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Register Admin
export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password, department } = req.body;

    if (await emailExistsGlobally(email)) {
      return res.status(400).json({
        success: false,
        message: "Email already exists in the system",
      });
    }

    const newAdmin = await admin.create({ name, email, password, department });
    const token = generateToken(newAdmin._id, "admin");

    res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      token,
      user: {
        id: newAdmin._id,
        name: capitalizeRole(newAdmin.name),
        email: newAdmin.email,
        role: capitalizeRole("admin"),
        department: newAdmin.department,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Register Manager
export const registerManager = async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    if (await emailExistsGlobally(email)) {
      return res.status(400).json({
        success: false,
        message: "Email already exists in the system",
      });
    }

    const newManager = await manager.create({
      name,
      email,
      mobile,
      password,
    });

    const token = generateToken(newManager._id, "manager");

    res.status(201).json({
      success: true,
      message: "Manager registered successfully",
      token,
      user: {
        id: newManager._id,
        name: capitalizeRole(newManager.name),
        email: newManager.email,
        mobile: newManager.mobile,
        role: capitalizeRole("manager"),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// ==================== LOGIN WITH OTP ====================

// Step 1: Login - Verify credentials and send OTP
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // Find user in all collections
    const { user, role } = await findUserByEmail(email);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Verify password
    const match = await user.comparePassword(password);
    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate OTP
    const otp = generateOTP();

    // Delete old OTPs for this email
    await OTP.deleteMany({ email });

    // Save OTP to database
    await OTP.create({ email, otp });

    // Send OTP via email
    await sendOTPEmail(email, otp);

    res.status(200).json({
      success: true,
      message: "OTP sent to your email",
      data: {
        email,
        role: capitalizeRole(role),
        userId: user._id,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Step 2: Verify OTP and complete login
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and OTP",
      });
    }

    // Find OTP in database
    const otpRecord = await OTP.findOne({ email, otp });

    if (!otpRecord) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    // Find user
    const { user, role } = await findUserByEmailForOTP(email);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Delete OTP after successful verification
    await OTP.deleteOne({ email, otp });

    // Generate JWT token
    const token = generateToken(user._id, role);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: capitalizeRole(user.name),
        email: user.email,
        role: capitalizeRole(role),
      },
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Resend OTP
export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please provide email",
      });
    }

    // Check if user exists
    const { user } = await findUserByEmailForOTP(email);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Delete old OTPs
    await OTP.deleteMany({ email });

    // Generate new OTP
    const otp = generateOTP();

    // Save OTP to database
    await OTP.create({ email, otp });

    // Send OTP via email
    await sendOTPEmail(email, otp);

    res.status(200).json({
      success: true,
      message: "New OTP sent to your email",
    });
  } catch (error) {
    console.error("Resend OTP error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// ==================== GET LOGGED IN USER ====================

export const getMe = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      user: {
        id: req.user._id,
        name: capitalizeRole(req.user.name),
        email: req.user.email,
        role: capitalizeRole(req.user.role),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
