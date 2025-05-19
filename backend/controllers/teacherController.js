const Teacher = require('../models/Teacher');
const Subject = require('../models/Subject');
const Class = require('../models/Class');

// @desc    Create a new teacher
// @route   POST /api/teachers
// @access  Private/Admin
exports.createTeacher = async (req, res) => {
  try {
    const { teacherId, name, department, subjectIds, contact, status, email } = req.body;

    // Check if teacher with the same ID already exists
    const teacherExists = await Teacher.findOne({ teacherId });

    if (teacherExists) {
      return res.status(400).json({ success: false, message: 'Teacher with this ID already exists' });
    }

    // Check if subjects exist and are not already assigned
    const invalidSubjects = await Subject.find({
      _id: { $in: subjectIds },
      teacher: { $exists: true, $ne: null }
    });

    if (invalidSubjects.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'One or more subjects are already assigned to other teachers',
        assignedSubjects: invalidSubjects.map(s => ({
          _id: s._id,
          name: s.name,
          subjectCode: s.subjectCode
        }))
      });
    }

    // Create new teacher
    const newTeacher = await Teacher.create({
      teacherId,
      name,
      department,
      subjects: subjectIds,
      contact,
      status: status || 'active',
      email
    });

    if (newTeacher) {
      // Update all subjects with teacher reference
      await Subject.updateMany(
        { _id: { $in: subjectIds } },
        { teacher: newTeacher._id },
        { new: true }
      );
      
      // Populate subjects in the response
      const populatedTeacher = await Teacher.findById(newTeacher._id).populate('subjects', 'name subjectCode');
      newTeacher.subjects = populatedTeacher.subjects;

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

// @desc    Update a teacher
// @route   PUT /api/teachers/:id
// @access  Private/Admin
exports.updateTeacher = async (req, res) => {
  try {
    const { name, department, subjectIds, contact, status, email } = req.body;
    const teacherId = req.params.id;

    // Find the teacher
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ 
        success: false, 
        message: 'Teacher not found' 
      });
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== teacher.email) {
      const emailExists = await Teacher.findOne({ email });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: 'Email already in use by another teacher'
        });
      }
    }

    // Check if subjects are being updated
    if (subjectIds && Array.isArray(subjectIds)) {
      // Check if any of the new subjects are already assigned to other teachers
      const invalidSubjects = await Subject.find({
        _id: { $in: subjectIds },
        teacher: { $nin: [null, teacherId] } // Either unassigned or assigned to this teacher
      });

      if (invalidSubjects.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'One or more subjects are already assigned to other teachers',
          assignedSubjects: invalidSubjects.map(s => ({
            _id: s._id,
            name: s.name,
            subjectCode: s.subjectCode
          }))
        });
      }

      // Get current subjects to compare
      const currentSubjectIds = teacher.subjects.map(id => id.toString());
      const subjectsToRemove = currentSubjectIds.filter(id => !subjectIds.includes(id));
      const subjectsToAdd = subjectIds.filter(id => !currentSubjectIds.includes(id));

      // Remove teacher reference from old subjects
      if (subjectsToRemove.length > 0) {
        await Subject.updateMany(
          { _id: { $in: subjectsToRemove } },
          { teacher: null },
          { new: true }
        );
      }

      // Add teacher reference to new subjects
      if (subjectsToAdd.length > 0) {
        await Subject.updateMany(
          { _id: { $in: subjectsToAdd } },
          { teacher: teacherId },
          { new: true }
        );
      }
    }

    // Prepare update data
    const updateData = {
      name: name || teacher.name,
      department: department || teacher.department,
      contact: contact || teacher.contact,
      status: status || teacher.status,
      email: email || teacher.email
    };

    // Only update subjects if provided
    if (subjectIds && Array.isArray(subjectIds)) {
      updateData.subjects = subjectIds;
    }

    // Update the teacher
    const updatedTeacher = await Teacher.findByIdAndUpdate(
      teacherId,
      updateData,
      { new: true, runValidators: true }
    )
    .populate({
      path: 'subjects',
      select: 'subjectCode name type status class',
      populate: {
        path: 'class',
        select: 'name classId'
      },
      options: { sort: { name: 1 } }
    })
    .select('-__v');

    res.status(200).json({
      success: true,
      data: updatedTeacher
    });
  } catch (error) {
    console.error('Error in updateTeacher:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get teacher by ID
// @route   GET /api/teachers/:id
// @access  Private/Admin
exports.getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id)
      .populate({
        path: 'subjects',
        select: 'subjectCode name type status class',
        populate: {
          path: 'class',
          select: 'name classId'
        },
        options: { sort: { name: 1 } }
      })
      .select('-__v');

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }

    res.status(200).json({
      success: true,
      data: teacher
    });
  } catch (error) {
    console.error('Error in getTeacherById:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get all teachers
// @route   GET /api/teachers
// @access  Private/Admin
exports.getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find({})
      .populate('subjects', 'name subjectCode')
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
    const subjectId = teacher.subjects;

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
