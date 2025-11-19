const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  // Authentication
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },

  // Personal Information
  phone: {
    type: String,
    default: ''
  },
  dateOfBirth: {
    type: Date,
    default: null
  },
  gender: {
    type: String,
    enum: ['', 'male', 'female', 'other', 'prefer-not-to-say'],
    default: ''
  },
  bloodGroup: {
    type: String,
    enum: ['', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    default: ''
  },
  emergencyContact: {
    type: String,
    default: ''
  },
  emergencyPhone: {
    type: String,
    default: ''
  },
  address: {
    type: String,
    default: ''
  },

  // Vital Statistics
  height: {
    type: String,
    default: ''
  },
  weight: {
    type: String,
    default: ''
  },
  bloodPressure: {
    type: String,
    default: ''
  },

  // Medical History
  medicalConditions: {
    type: String,
    default: ''
  },
  currentMedications: {
    type: String,
    default: ''
  },
  allergies: {
    type: String,
    default: ''
  },
  surgeries: {
    type: String,
    default: ''
  },
  familyHistory: {
    type: String,
    default: ''
  },

  // Lifestyle Information
  smoking: {
    type: String,
    enum: ['', 'never', 'former', 'current'],
    default: ''
  },
  alcohol: {
    type: String,
    enum: ['', 'never', 'occasional', 'regular'],
    default: ''
  },
  exercise: {
    type: String,
    enum: ['', 'sedentary', 'light', 'moderate', 'active'],
    default: ''
  },
  diet: {
    type: String,
    enum: ['', 'omnivore', 'vegetarian', 'vegan', 'pescatarian', 'keto', 'other'],
    default: ''
  },
  sleepHours: {
    type: Number,
    min: 0,
    max: 24,
    default: null
  },

  // Timestamps
  lastLogin: {
    type: Date,
    default: Date.now
  }

}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Update lastLogin on login
userSchema.methods.updateLastLogin = async function() {
  this.lastLogin = Date.now();
  return this.save({ validateBeforeSave: false });
};

module.exports = mongoose.model('User', userSchema);