const Job = require('../models/Job');

// Get all jobs
exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new job
exports.createJob = async (req, res) => {
  try {
    // Validate required fields
    const requiredFields = ['company', 'position', 'experience', 'location', 'workType', 'salary', 'description'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Set default deadline if not provided (30 days from now)
    const deadline = req.body.deadline ? new Date(req.body.deadline) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    // Create new job instance
    const jobData = {
      company: req.body.company,
      position: req.body.position,
      experience: req.body.experience,
      location: req.body.location,
      workType: req.body.workType,
      salary: req.body.salary,
      description: Array.isArray(req.body.description) ? req.body.description : [req.body.description],
      logo: req.body.logo || '../images/default-logo.png',
      deadline: deadline
    };

    const job = new Job(jobData);
    const savedJob = await job.save();
    res.status(201).json(savedJob);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation Error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    res.status(500).json({ message: error.message });
  }
};

// Get a single job
exports.getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a job
exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json(job);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation Error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    res.status(400).json({ message: error.message });
  }
};

// Delete a job
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 