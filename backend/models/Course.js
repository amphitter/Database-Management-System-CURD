// backend/models/Course.js
const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Course title is required'],
    unique: true
  },
  duration: {
    type: String,
    default: 'Not Specified'
  },
  fees: {
    type: Number,
    required: [true, 'Course fees are required'],
    min: [0, 'Fees cannot be negative']
  },
  description: String,
  userId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});



module.exports = mongoose.model('Course', CourseSchema);