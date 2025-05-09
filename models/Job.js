const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  company: {
    type: String,
    required: [true, 'Company name is required']
  },
  position: {
    type: String,
    required: [true, 'Job position is required']
  },
  experience: {
    type: String,
    required: [true, 'Experience is required']
  },
  location: {
    type: String,
    required: [true, 'Location is required']
  },
  workType: {
    type: String,
    required: [true, 'Work type is required']
  },
  salary: {
    type: String,
    required: [true, 'Salary is required']
  },
  description: [{
    type: String,
    required: [true, 'Description is required']
  }],
  logo: {
    type: String,
    required: [true, 'Logo is required'],
    default: '../images/default-logo.png'
  },
  deadline: {
    type: Date,
    required: [true, 'Deadline is required']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  _id: true  // Explicitly enable _id
});

module.exports = mongoose.model('Job', jobSchema); 