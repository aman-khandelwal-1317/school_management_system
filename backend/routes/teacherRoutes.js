const express = require('express');
const router = express.Router();
const { createTeacher, getAllTeachers, deleteTeacher, getTeacherById } = require('../controllers/teacherController');
const { protect, admin } = require('../middlewares/authMiddleware');

// Teacher routes
// All routes are protected and require admin access
router.route('/')
  .post(protect, admin, createTeacher)
  .get(protect, admin, getAllTeachers);

// Route for specific teacher by ID
router.route('/:id')
  .get(protect, admin, getTeacherById)
  .delete(protect, admin, deleteTeacher);

module.exports = router;
