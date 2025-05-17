const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
  subjectCode: {
    type: String,
    required: [true, 'Subject code is required'],
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: [true, 'Subject name is required'],
    trim: true
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    trim: true
  },
  type: {
    type: String,
    required: [true, 'Subject type is required'],
    enum: ['Theory', 'Practical'],
    default: 'Theory'
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: [true, 'Class is required']
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    default: null
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Subject', SubjectSchema);
