const Draft = require('../models/Draft');

// Get all drafts
exports.getDrafts = async (req, res) => {
  try {
    const drafts = await Draft.find().sort({ createdAt: -1 });
    res.json(drafts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new draft
exports.createDraft = async (req, res) => {
  try {
    const draft = new Draft(req.body);
    const savedDraft = await draft.save();
    res.status(201).json(savedDraft);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get a single draft
exports.getDraft = async (req, res) => {
  try {
    const draft = await Draft.findById(req.params.id);
    if (!draft) {
      return res.status(404).json({ message: 'Draft not found' });
    }
    res.json(draft);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a draft
exports.updateDraft = async (req, res) => {
  try {
    const draft = await Draft.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!draft) {
      return res.status(404).json({ message: 'Draft not found' });
    }
    res.json(draft);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a draft
exports.deleteDraft = async (req, res) => {
  try {
    const draft = await Draft.findByIdAndDelete(req.params.id);
    if (!draft) {
      return res.status(404).json({ message: 'Draft not found' });
    }
    res.json({ message: 'Draft deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 