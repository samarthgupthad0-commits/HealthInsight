const express = require('express');
const {
  createConsultation,
  getConsultations,
  deleteConsultation
} = require('../controllers/consultationController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, createConsultation);
router.get('/', protect, getConsultations);
router.delete('/:id', protect, deleteConsultation);

module.exports = router;
