const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');

router.get('/dashboard', protect, (req, res) => {
    res.json({ message: 'Welcome to the protected dashboard', user: req.user });
  });

  module.exports = router;