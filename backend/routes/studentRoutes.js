const express = require('express');
const router = express.Router();
const { createStudent, getAllStudents, deleteStudent, getStudentById } = require('../controllers/studentController');
const { protect, admin } = require('../middlewares/authMiddleware');

// Student routes
// All routes are protected and require admin access
router.route('/')
  .post(protect, admin, createStudent)
  .get(protect, admin, getAllStudents);

// Route for specific student by ID
router.route('/:id')
  .get(protect, admin, getStudentById)
  .delete(protect, admin, deleteStudent);

module.exports = router;
