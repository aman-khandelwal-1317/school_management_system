const Teacher = require('../models/Teacher');
const Subject = require('../models/Subject');
const Class = require('../models/Class');

// @desc    Create a new teacher
// @route   POST /api/teachers
// @access  Private/Admin
exports.createTeacher = async (req, res) => {
  try {
    const { teacherId, name, department, subjectId, contact, status, email } = req.body;

    // Check if teacher with the same ID already exists
    const teacherExists = await Teacher.findOne({ teacherId });

    if (teacherExists) {
      return res.status(400).json({ success: false, message: 'Teacher with this ID already exists' });
    }

    // Check if the subject exists
    const subjectExists = await Subject.findById(subjectId);
    if (!subjectExists) {
      return res.status(404).json({ success: false, message: 'Subject not found' });
    }

    // Create new teacher
    const newTeacher = await Teacher.create({
      teacherId,
      name,
      department,
      subject: subjectId,
      contact,
      status: status || 'active',
      email
    });

    if (newTeacher) {
      // Update subject with teacher reference
      await Subject.findByIdAndUpdate(
        subjectId,
        { teacher: newTeacher._id },
        { new: true }
      );

      res.status(201).json({
        success: true,
        data: newTeacher
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid teacher data' });
    }
  } catch (error) {
    console.error('Error in createTeacher:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get all teachers
// @route   GET /api/teachers
// @access  Private/Admin
exports.getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find({})
      .populate('subject', 'name subjectCode')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: teachers.length,
      data: teachers
    });
  } catch (error) {
    console.error('Error in getAllTeachers:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Delete a teacher
// @route   DELETE /api/teachers/:id
// @access  Private/Admin
exports.deleteTeacher = async (req, res) => {
  try {
    const teacherId = req.params.id;

    // Find the teacher
    const teacher = await Teacher.findById(teacherId);

    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher not found' });
    }

    // Get the subject and classes before deleting the teacher
    const subjectId = teacher.subject;

    // Delete the teacher
    await Teacher.findByIdAndDelete(teacherId);

    // Update the subject to remove teacher reference
    if (subjectId) {
      await Subject.findByIdAndUpdate(
        subjectId,
        { teacher: null },
        { new: true }
      );
    }

    res.status(200).json({
      success: true,
      message: 'Teacher deleted successfully'
    });
  } catch (error) {
    console.error('Error in deleteTeacher:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
