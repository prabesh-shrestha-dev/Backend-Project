const express = require('express');
const router = express.Router();
const path = require('path');

router.get(['/', '/index.html', '/index'], (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});

router.get(['/new-page.html', '/new-page'], (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'new-page.html'));
});

// Redirect
router.get(['/old-page.html', '/old-page'], (req, res) => {
  // Permanently moved to new page // 301
  res.redirect(301, '/new-page.html'); // 302 by default
});

module.exports = router;