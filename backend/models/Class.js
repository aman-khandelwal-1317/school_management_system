const mongoose = require('mongoose');

const ClassSchema = new mongoose.Schema({
  classId: {
    type: String,
    required: [true, 'Class ID is required'],
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: [true, 'Class name is required'],
    trim: true
  },
  classTeacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    default: null
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  }],
  subjects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject'
  }],
  roomNo: {
    type: String,
    required: [true, 'Room number is required']
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

module.exports = mongoose.model('Class', ClassSchema);
