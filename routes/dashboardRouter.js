var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.send({ statistics: { connectedDevices: 10, disconnectedDevices: 5 }});
});

module.exports = router;
