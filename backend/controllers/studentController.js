const Student = require('../models/Student');
const Class = require('../models/Class');

// @desc    Create a new student
// @route   POST /api/students
// @access  Private/Admin
exports.createStudent = async (req, res) => {
  try {
    const { 
      studentId, 
      name, 
      email, 
      classId, 
      gender, 
      phone, 
      status,
      fatherName,
      motherName,
      address
    } = req.body;

    // Check if student with the same ID already exists
    const studentExists = await Student.findOne({ 
      $or: [{ studentId }, { email }]
    });

    if (studentExists) {
      return res.status(400).json({ 
        message: studentExists.studentId === studentId 
          ? 'Student with this ID already exists' 
          : 'Student with this email already exists' 
      });
    }

    // Check if the class exists
    const classExists = await Class.findById(classId);
    if (!classExists) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Create new student
    const newStudent = await Student.create({
      studentId,
      name,
      email,
      class: classId,
      gender,
      phone,
      status: status || 'active',
      fatherName,
      motherName,
      address
    });

    if (newStudent) {
      // Add student to class's students array
      await Class.findByIdAndUpdate(
        classId,
        { $push: { students: newStudent._id } },
        { new: true }
      );

      res.status(201).json({
        success: true,
        data: newStudent
      });
    } else {
      res.status(400).json({ message: 'Invalid student data' });
    }
  } catch (error) {
    console.error('Error in createStudent:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update a student
// @route   PUT /api/students/:id
// @access  Private/Admin
exports.updateStudent = async (req, res) => {
  try {
    const {
      name,
      email,
      classId,
      gender,
      phone,
      status,
      fatherName,
      motherName,
      address
    } = req.body;

    // Find the student
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== student.email) {
      const emailExists = await Student.findOne({ email });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: 'Email already in use by another student'
        });
      }
    }

    // Check if class is being changed and if it exists
    let oldClassId = student.class;
    if (classId && classId !== oldClassId.toString()) {
      const classExists = await Class.findById(classId);
      if (!classExists) {
        return res.status(404).json({
          success: false,
          message: 'Class not found'
        });
      }
    }

    // Update student
    const updateData = {
      name: name || student.name,
      email: email || student.email,
      class: classId || student.class,
      gender: gender || student.gender,
      phone: phone || student.phone,
      status: status || student.status,
      fatherName: fatherName || student.fatherName,
      motherName: motherName || student.motherName,
      address: address || student.address
    };

    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
    .populate('class', 'name classId')
    .select('-__v');

    // If class was changed, update the class's students array
    if (classId && classId !== oldClassId.toString()) {
      // Remove from old class
      await Class.findByIdAndUpdate(
        oldClassId,
        { $pull: { students: student._id } },
        { new: true }
      );

      // Add to new class
      await Class.findByIdAndUpdate(
        classId,
        { $addToSet: { students: student._id } },
        { new: true }
      );
    }

    res.status(200).json({
      success: true,
      data: updatedStudent
    });
  } catch (error) {
    console.error('Error in updateStudent:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get student by ID
// @route   GET /api/students/:id
// @access  Private/Admin
exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('class', 'name classId')
      .select('-__v');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    console.error('Error in getStudentById:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get all students
// @route   GET /api/students
// @access  Private/Admin
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find({})
      .populate('class', 'name classId')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (error) {
    console.error('Error in getAllStudents:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete a student
// @route   DELETE /api/students/:id
// @access  Private/Admin
exports.deleteStudent = async (req, res) => {
  try {
    const studentId = req.params.id;

    // Find the student
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Get the class ID before deleting the student
    const classId = student.class;

    // Delete the student
    await Student.findByIdAndDelete(studentId);

    // Remove student from class's students array
    if (classId) {
      await Class.findByIdAndUpdate(
        classId,
        { $pull: { students: studentId } },
        { new: true }
      );
    }

    res.status(200).json({
      success: true,
      message: 'Student deleted successfully'
    });
  } catch (error) {
    console.error('Error in deleteStudent:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
