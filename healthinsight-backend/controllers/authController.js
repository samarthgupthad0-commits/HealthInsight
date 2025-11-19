const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d',
  });
};

// @desc    Register user
// @route   POST /api/auth/signup
// @access  Public
exports.register = async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword } = req.body;

    // Validation
    if (!fullName || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // In the register function, update the user creation:
const user = await User.create({
  fullName,
  email,
  password,
  gender: '', // Add default empty values for required fields
  bloodGroup: '',
  smoking: '',
  alcohol: '',
  exercise: '',
  diet: ''
});

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        bloodGroup: user.bloodGroup,
        emergencyContact: user.emergencyContact,
        emergencyPhone: user.emergencyPhone,
        address: user.address,
        height: user.height,
        weight: user.weight,
        bloodPressure: user.bloodPressure,
        medicalConditions: user.medicalConditions,
        currentMedications: user.currentMedications,
        allergies: user.allergies,
        surgeries: user.surgeries,
        familyHistory: user.familyHistory,
        smoking: user.smoking,
        alcohol: user.alcohol,
        exercise: user.exercise,
        diet: user.diet,
        sleepHours: user.sleepHours,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      token // MAKE SURE THIS IS INCLUDED
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Check if user exists and password is correct
    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    // Update last login
    await user.updateLastLogin();

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        bloodGroup: user.bloodGroup,
        emergencyContact: user.emergencyContact,
        emergencyPhone: user.emergencyPhone,
        address: user.address,
        height: user.height,
        weight: user.weight,
        bloodPressure: user.bloodPressure,
        medicalConditions: user.medicalConditions,
        currentMedications: user.currentMedications,
        allergies: user.allergies,
        surgeries: user.surgeries,
        familyHistory: user.familyHistory,
        smoking: user.smoking,
        alcohol: user.alcohol,
        exercise: user.exercise,
        diet: user.diet,
        sleepHours: user.sleepHours,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      token // MAKE SURE THIS IS INCLUDED
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.json({
      success: true,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        bloodGroup: user.bloodGroup,
        emergencyContact: user.emergencyContact,
        emergencyPhone: user.emergencyPhone,
        address: user.address,
        height: user.height,
        weight: user.weight,
        bloodPressure: user.bloodPressure,
        medicalConditions: user.medicalConditions,
        currentMedications: user.currentMedications,
        allergies: user.allergies,
        surgeries: user.surgeries,
        familyHistory: user.familyHistory,
        smoking: user.smoking,
        alcohol: user.alcohol,
        exercise: user.exercise,
        diet: user.diet,
        sleepHours: user.sleepHours,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching profile'
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const {
      fullName, phone, dateOfBirth, gender, bloodGroup,
      emergencyContact, emergencyPhone, address, height,
      weight, bloodPressure, medicalConditions, currentMedications,
      allergies, surgeries, familyHistory, smoking, alcohol,
      exercise, diet, sleepHours
    } = req.body;

    // Find user and update
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update user fields
    const updateData = {
      fullName, phone, dateOfBirth, gender, bloodGroup,
      emergencyContact, emergencyPhone, address, height,
      weight, bloodPressure, medicalConditions, currentMedications,
      allergies, surgeries, familyHistory, smoking, alcohol,
      exercise, diet, sleepHours
    };

    // Remove undefined fields
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        user[key] = updateData[key];
      }
    });

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        bloodGroup: user.bloodGroup,
        emergencyContact: user.emergencyContact,
        emergencyPhone: user.emergencyPhone,
        address: user.address,
        height: user.height,
        weight: user.weight,
        bloodPressure: user.bloodPressure,
        medicalConditions: user.medicalConditions,
        currentMedications: user.currentMedications,
        allergies: user.allergies,
        surgeries: user.surgeries,
        familyHistory: user.familyHistory,
        smoking: user.smoking,
        alcohol: user.alcohol,
        exercise: user.exercise,
        diet: user.diet,
        sleepHours: user.sleepHours,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    
    // Handle duplicate email error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while updating profile'
    });
  }
};