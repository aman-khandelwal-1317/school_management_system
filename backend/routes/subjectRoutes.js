const express = require('express');
const router = express.Router();
const { 
  addSubject, 
  getAllSubjects, 
  deleteSubject, 
  getSubjectById,
  updateSubject 
} = require('../controllers/subjectController');
const { protect, admin } = require('../middlewares/authMiddleware');

// Subject routes
// All routes are protected and require admin access
router.route('/')
  .post(protect, admin, addSubject)
  .get(protect, admin, getAllSubjects);

// Route for specific subject by ID
router.route('/:id')
  .get(protect, admin, getSubjectById)
  .put(protect, admin, updateSubject)
  .delete(protect, admin, deleteSubject);

module.exports = router;
