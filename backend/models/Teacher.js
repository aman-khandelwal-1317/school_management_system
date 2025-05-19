const mongoose = require('mongoose');

const TeacherSchema = new mongoose.Schema({
  teacherId: {
    type: String,
    required: [true, 'Teacher ID is required'],
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    trim: true
  },
  subjects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: [true, 'At least one subject is required']
  }],
  contact: {
    type: String,
    required: [true, 'Contact information is required'],
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Teacher', TeacherSchema);
