const express = require('express');
const { 
  protectAdmin, 
  superAdminOnly, 
  checkPermission 
} = require('../middleware/authMiddleware');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const { catchAsync, APIError } = require('../middleware/errorHandler');

const router = express.Router();

// Admin login
router.post('/login', catchAsync(async (req, res) => {
  const { username, password } = req.body;

  // Find admin by username
  const admin = await Admin.findOne({ username });
  if (!admin || !(await admin.comparePassword(password))) {
    throw new APIError('Invalid credentials', 401);
  }

  // Update last login
  await admin.updateLastLogin();

  // Generate token
  const token = jwt.sign(
    { id: admin._id },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  res.status(200).json({
    status: 'success',
    data: {
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
        permissions: admin.permissions
      }
    }
  });
}));

// All routes below this require admin authentication
router.use(protectAdmin);

// Get admin profile
router.get('/profile', catchAsync(async (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      admin: req.admin
    }
  });
}));

// Update admin profile
router.patch('/profile', catchAsync(async (req, res) => {
  const { email, currentPassword, newPassword } = req.body;
  const admin = req.admin;

  // If updating password, verify current password
  if (newPassword) {
    if (!currentPassword) {
      throw new APIError('Please provide current password', 400);
    }

    if (!(await admin.comparePassword(currentPassword))) {
      throw new APIError('Current password is incorrect', 401);
    }

    admin.password = newPassword;
  }

  if (email) admin.email = email;
  await admin.save();

  res.status(200).json({
    status: 'success',
    data: {
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
        permissions: admin.permissions
      }
    }
  });
}));

// Super admin routes
router.use(superAdminOnly);

// Create new admin
router.post('/', catchAsync(async (req, res) => {
  const { username, email, password, role, permissions } = req.body;

  const admin = await Admin.create({
    username,
    email,
    password,
    role,
    permissions
  });

  res.status(201).json({
    status: 'success',
    data: {
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
        permissions: admin.permissions
      }
    }
  });
}));

// Get all admins
router.get('/', catchAsync(async (req, res) => {
  const admins = await Admin.find()
    .select('-password')
    .sort('-createdAt');

  res.status(200).json({
    status: 'success',
    results: admins.length,
    data: {
      admins
    }
  });
}));

// Update admin
router.patch('/:id', catchAsync(async (req, res) => {
  const { role, permissions, isActive } = req.body;
  
  const admin = await Admin.findById(req.params.id);
  if (!admin) {
    throw new APIError('Admin not found', 404);
  }

  // Update fields
  if (role) admin.role = role;
  if (permissions) admin.permissions = permissions;
  if (typeof isActive === 'boolean') admin.isActive = isActive;

  await admin.save();

  res.status(200).json({
    status: 'success',
    data: {
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
        permissions: admin.permissions,
        isActive: admin.isActive
      }
    }
  });
}));

// Delete admin
router.delete('/:id', catchAsync(async (req, res) => {
  const admin = await Admin.findById(req.params.id);
  
  if (!admin) {
    throw new APIError('Admin not found', 404);
  }

  // Prevent self-deletion
  if (admin._id.toString() === req.admin._id.toString()) {
    throw new APIError('Cannot delete your own account', 400);
  }

  await Admin.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: 'success',
    data: null
  });
}));

module.exports = router;
