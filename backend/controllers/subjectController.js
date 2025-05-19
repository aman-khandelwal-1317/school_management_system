const Subject = require('../models/Subject');
const Class = require('../models/Class');
const Teacher = require('../models/Teacher');

// @desc    Add a new subject
// @route   POST /api/subjects
// @access  Private/Admin
exports.addSubject = async (req, res) => {
  try {
    const { subjectCode, name, department, type, classId, status } = req.body;

    // Check if subject with the same code already exists
    const subjectExists = await Subject.findOne({ subjectCode });

    if (subjectExists) {
      return res.status(400).json({ message: 'Subject with this code already exists' });
    }

    // Check if the class exists
    const classExists = await Class.findById(classId);
    if (!classExists) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Create new subject
    const newSubject = await Subject.create({
      subjectCode,
      name,
      department,
      type: type || 'theory',
      class: classId,
      teacher: null, // Set to null until we have Teacher model
      status: status || 'active'
    });

    if (newSubject) {
      // Add the subject to the class's subjects array
      await Class.findByIdAndUpdate(
        classId,
        { $addToSet: { subjects: newSubject._id } },
        { new: true }
      );

      // Populate the class and teacher in the response
      const populatedSubject = await Subject.findById(newSubject._id)
        .populate('class', 'name classId')
        .populate('teacher', 'name teacherId');

      res.status(201).json({
        success: true,
        data: populatedSubject
      });
    } else {
      res.status(400).json({ message: 'Invalid subject data' });
    }
  } catch (error) {
    console.error('Error in addSubject:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get subject by ID
// @route   GET /api/subjects/:id
// @access  Private/Admin
exports.getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id)
      .populate({
        path: 'class',
        select: 'name classId academicYear'
      })
      .populate({
        path: 'teacher',
        select: 'name teacherId email contact'
      })
      .select('-__v');

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }

    res.status(200).json({
      success: true,
      data: subject
    });
  } catch (error) {
    console.error('Error in getSubjectById:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get all subjects
// @route   GET /api/subjects
// @access  Private/Admin
exports.getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find({})
      .populate('class', 'name classId')
      .populate('teacher', 'name teacherId')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: subjects.length,
      data: subjects
    });
  } catch (error) {
    console.error('Error in getAllSubjects:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete a subject
// @route   DELETE /api/subjects/:id
// @access  Private/Admin
exports.deleteSubject = async (req, res) => {
  try {
    const subjectId = req.params.id;

    // Find the subject
    const subject = await Subject.findById(subjectId);

    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    // Check if any teachers are assigned to this subject
    const teacherCount = await Teacher.countDocuments({ subject: subjectId });
    if (teacherCount > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete subject assigned to teachers. Please reassign or delete teachers first.'
      });
    }

    // Delete the subject
    await Subject.findByIdAndDelete(subjectId);

    res.status(200).json({
      success: true,
      message: 'Subject deleted successfully'
    });
  } catch (error) {
    console.error('Error in deleteSubject:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
