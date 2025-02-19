const express = require('express');

const path = require('path');

const router = express.Router();

// Serve integration.json
router.get('/integration.json', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../config/integration.json'));
});

module.exports = router;
