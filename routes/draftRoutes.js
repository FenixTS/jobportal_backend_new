const express = require('express');
const router = express.Router();
const draftController = require('../controllers/draftController');

router.get('/', draftController.getDrafts);
router.post('/', draftController.createDraft);
router.get('/:id', draftController.getDraft);
router.put('/:id', draftController.updateDraft);
router.delete('/:id', draftController.deleteDraft);

module.exports = router; 