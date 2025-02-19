const express = require('express');
const { processTick } = require('../controllers/tickController');

const router = express.Router();

// Tick endpoint
router.post('/tick', processTick);

module.exports = router;
