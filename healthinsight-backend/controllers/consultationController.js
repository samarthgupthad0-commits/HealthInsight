const Consultation = require('../models/Consultation');

// @desc    Create new consultation record
// @route   POST /api/consultations
// @access  Private
exports.createConsultation = async (req, res) => {
  try {
    const {
      primarySymptom,
      additionalSymptoms,
      symptomDuration,
      symptomSeverity,
      age,
      gender,
      conditions,
      currentMeds,
      allergies,
      medications
    } = req.body;

    if (!primarySymptom) {
      return res.status(400).json({
        success: false,
        message: 'Primary symptom is required'
      });
    }

    const consultation = await Consultation.create({
      user: req.user.id,
      primarySymptom,
      additionalSymptoms: additionalSymptoms || [],
      duration: symptomDuration || '',
      severity: symptomSeverity || '',
      age: age ? Number(age) : undefined,
      gender: gender || '',
      conditions: conditions || [],
      currentMeds: currentMeds || '',
      allergies: allergies || '',
      medications: medications || []
    });

    res.status(201).json({
      success: true,
      message: 'Consultation saved successfully',
      consultation
    });
  } catch (error) {
    console.error('Create consultation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while saving consultation'
    });
  }
};

// @desc    Get all consultations for current user
// @route   GET /api/consultations
// @access  Private
exports.getConsultations = async (req, res) => {
  try {
    const consultations = await Consultation.find({ user: req.user.id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: consultations.length,
      consultations
    });
  } catch (error) {
    console.error('Get consultations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching consultations'
    });
  }
};

// @desc    Delete a consultation record
// @route   DELETE /api/consultations/:id
// @access  Private
exports.deleteConsultation = async (req, res) => {
  try {
    const consultation = await Consultation.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: 'Consultation not found or not authorized'
      });
    }

    res.json({
      success: true,
      message: 'Consultation deleted successfully'
    });
  } catch (error) {
    console.error('Delete consultation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting consultation'
    });
  }
};
