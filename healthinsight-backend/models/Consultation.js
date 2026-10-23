const mongoose = require('mongoose');

const consultationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  primarySymptom: {
    type: String,
    required: [true, 'Primary symptom is required']
  },
  additionalSymptoms: [{
    type: String
  }],
  duration: {
    type: String,
    default: ''
  },
  severity: {
    type: String,
    default: ''
  },
  age: {
    type: Number
  },
  gender: {
    type: String
  },
  conditions: [{
    type: String
  }],
  currentMeds: {
    type: String,
    default: ''
  },
  allergies: {
    type: String,
    default: ''
  },
  medications: [{
    name: String,
    type: { type: String },
    purpose: String,
    dosage: String,
    sideEffects: [String],
    warnings: [String],
    interactions: [String],
    link: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Consultation', consultationSchema);
