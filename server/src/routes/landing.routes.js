const express = require('express');
const router = express.Router();
const { getSection } = require('../controllers/landingController');

router.get('/:section', getSection);

module.exports = router;
