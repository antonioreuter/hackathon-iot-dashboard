const express = require('express');
const router = express.Router();

/* GET devices. */
router.get('/', function(req, res) {
  const collection = [{name: 'Sample 01'}];

  res.send(collection);
});

module.exports = router;
