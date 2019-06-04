const express = require('express');
const path = require('path');

const router = express.Router();

router.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../pages/index.html'));
});

router.get('/dashboard', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../pages/index.html'));
});

router.get('/device_dashboard', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../pages/device_dashboard.html'));
});

router.get('/device_detail', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../pages/device.html'));
});

module.exports = router;
