const mongoose = require('mongoose');

const draftSchema = new mongoose.Schema({
  company: {
    type: String,
    required: true
  },
  position: {
    type: String,
    required: true
  },
  experience: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  workType: {
    type: String,
    required: true
  },
  salary: {
    type: String,
    required: true
  },
  description: [{
    type: String,
    required: true
  }],
  logo: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'draft'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Draft', draftSchema); 