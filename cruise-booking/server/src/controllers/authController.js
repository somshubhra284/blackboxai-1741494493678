const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { catchAsync, APIError } = require('../middleware/errorHandler');

// Generate token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Register a new user
exports.register = catchAsync(async (req, res, next) => {
  const { name, email, phone, password, dateOfBirth, gender, userType, businessName, registrationNumber } = req.body;

  // Validate userType
  if (userType === 'business' && (!businessName || !registrationNumber)) {
    return next(new APIError('Business name and registration number are required for business users', 400));
  }

  const user = await User.create({
    name,
    email,
    phone,
    password,
    dateOfBirth,
    gender,
    userType,
    businessName: userType === 'business' ? businessName : undefined,
    registrationNumber: userType === 'business' ? registrationNumber : undefined,
  });

  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    token,
    data: user,
  });
});

exports.requestOtp = catchAsync(async (req, res, next) => {
  // Logic for requesting OTP
  res.status(200).json({ success: true, message: 'OTP sent' });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // Logic for user login
  res.status(200).json({ success: true, token: 'dummy_token' });
});

exports.refreshToken = catchAsync(async (req, res, next) => {
  // Logic for refreshing token
  res.status(200).json({ success: true, token: 'new_dummy_token' });
});

exports.getProfile = catchAsync(async (req, res, next) => {
  const userId = req.user.id; // Assuming user ID is stored in req.user
  const user = await User.findById(userId);
  
  if (!user) {
    return next(new APIError('User not found', 404));
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

exports.logout = catchAsync(async (req, res, next) => {
  // Logic for user logout
  res.status(200).json({ success: true, message: 'User logged out' });
});
