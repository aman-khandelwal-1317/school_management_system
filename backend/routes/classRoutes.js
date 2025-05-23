const express = require('express');
const router = express.Router();
const { 
  addClass, 
  getAllClasses, 
  deleteClass, 
  getClassById,
  updateClass 
} = require('../controllers/classController');
const { protect, admin } = require('../middlewares/authMiddleware');

// Class routes
// All routes are protected and require admin access
router.route('/')
  .post(protect, admin, addClass)
  .get(protect, admin, getAllClasses);

// Route for specific class by ID
router.route('/:id')
  .get(protect, admin, getClassById)
  .put(protect, admin, updateClass)
  .delete(protect, admin, deleteClass);

module.exports = router;
