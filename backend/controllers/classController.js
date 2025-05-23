const Class = require('../models/Class');
const Student = require('../models/Student');
const Subject = require('../models/Subject');
const Teacher = require('../models/Teacher');

// @desc    Create a new class
// @route   POST /api/classes
// @access  Private/Admin
exports.addClass = async (req, res) => {
  try {
    const { classId, classTeacher, name, roomNo, status } = req.body;

    // Check if class with the same ID already exists
    const classExists = await Class.findOne({ classId });

    if (classExists) {
      return res.status(400).json({ success: false, message: 'Class with this ID already exists' });
    }

    // Check if class teacher exists
    const classTeacherExists = await Teacher.findById(classTeacher);
    if (!classTeacherExists) {
      return res.status(400).json({ success: false, message: 'Class teacher not found' });
    }

    // Create new class
    const newClass = await Class.create({
      classId,
      name,
      roomNo,
      status: status || 'active',
      classTeacher: classTeacher,
      students: []
    });

    if (newClass) {
      res.status(201).json({
        success: true,
        data: newClass
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid class data' });
    }
  } catch (error) {
    console.error('Error in addClass:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get class by ID
// @route   GET /api/classes/:id
// @access  Private/Admin
exports.getClassById = async (req, res) => {
  try {
    const classData = await Class.findById(req.params.id)
      .populate({
        path: 'classTeacher',
        select: 'name teacherId email'
      })
      .populate({
        path: 'students',
        select: 'studentId name email phone status',
        options: { sort: { name: 1 } }
      })
      .populate({
        path: 'subjects',
        select: 'subjectCode name type status',
        options: { sort: { name: 1 } }
      })
      .select('-__v');

    if (!classData) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }

    res.status(200).json({
      success: true,
      data: classData
    });
  } catch (error) {
    console.error('Error in getClassById:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get all classes
// @route   GET /api/classes
// @access  Private/Admin
exports.getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find({}).populate('classTeacher', 'name').sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: classes.length,
      data: classes
    });
  } catch (error) {
    console.error('Error in getAllClasses:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Update a class
// @route   PUT /api/classes/:id
// @access  Private/Admin
exports.updateClass = async (req, res) => {
  try {
    const { name, classTeacher, roomNo, status } = req.body;
    const classId = req.params.id;

    // Find the class
    const existingClass = await Class.findById(classId);
    if (!existingClass) {
      return res.status(404).json({ 
        success: false, 
        message: 'Class not found' 
      });
    }

    // Check if class teacher exists if being updated
    if (classTeacher && classTeacher !== existingClass.classTeacher?.toString()) {
      const teacherExists = await Teacher.findById(classTeacher);
      if (!teacherExists) {
        return res.status(400).json({ 
          success: false, 
          message: 'Class teacher not found' 
        });
      }
    }

    // Prepare update data
    const updateData = {
      name: name || existingClass.name,
      roomNo: roomNo || existingClass.roomNo,
      status: status || existingClass.status,
      classTeacher: classTeacher || existingClass.classTeacher
    };

    // Update the class
    const updatedClass = await Class.findByIdAndUpdate(
      classId,
      updateData,
      { new: true, runValidators: true }
    )
    .populate({
      path: 'classTeacher',
      select: 'name teacherId email'
    })
    .populate({
      path: 'students',
      select: 'studentId name email phone status',
      options: { sort: { name: 1 } }
    })
    .populate({
      path: 'subjects',
      select: 'subjectCode name type status',
      options: { sort: { name: 1 } }
    })
    .select('-__v');

    res.status(200).json({
      success: true,
      data: updatedClass
    });
  } catch (error) {
    console.error('Error in updateClass:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// @desc    Delete a class
// @route   DELETE /api/classes/:id
// @access  Private/Admin
exports.deleteClass = async (req, res) => {
  try {
    const classId = req.params.id;

    // Find the class
    const classToDelete = await Class.findById(classId);

    if (!classToDelete) {
      return res.status(404).json({ success: false, message: 'Class not found' });
    }

    // Check if class has students
    const studentCount = await Student.countDocuments({ class: classId });
    if (studentCount > 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Cannot delete class with assigned students. Please reassign or delete students first.'
      });
    }

    // Check if class has subjects
    const subjectCount = await Subject.countDocuments({ class: classId });
    if (subjectCount > 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Cannot delete class with assigned subjects. Please reassign or delete subjects first.'
      });
    }

    // Remove class from any teachers that have it assigned
    await Teacher.updateMany(
      { classes: classId },
      { $pull: { classes: classId } }
    );

    // Delete the class
    await Class.findByIdAndDelete(classId);

    res.status(200).json({
      success: true,
      message: 'Class deleted successfully'
    });
  } catch (error) {
    console.error('Error in deleteClass:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
