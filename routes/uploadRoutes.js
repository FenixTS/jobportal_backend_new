const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');

router.post('/', uploadController.uploadLogo, uploadController.handleUpload);

module.exports = router; 