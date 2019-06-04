var express = require('express');

const ConnectionService = require('../src/services/connectionService');

var router = express.Router();

router.get('/', async (req, res) => {
  const connectionService = new ConnectionService();
  const [ numberOfDevices, numberOfConnectedDevices ] = await Promise.all([
    connectionService.countAllDevices(),
    connectionService.countConnectedDevices()
  ]);
  res.send({
    statistics: {
      connectedDevices: numberOfConnectedDevices,
      disconnectedDevices: numberOfDevices - numberOfConnectedDevices
    }
  });
});

router.get('/application/:id', async (req, res) => {
  const applicationGuid = req.params.id;
  const connectionService = new ConnectionService();
  const [ numberOfDevices, numberOfConnectedDevices ] = await Promise.all([
    connectionService.countAllDevices(applicationGuid),
    connectionService.countConnectedDevices(applicationGuid)
  ]);
  res.send({
    statistics: {
      connectedDevices: numberOfConnectedDevices,
      disconnectedDevices: numberOfDevices - numberOfConnectedDevices
    }
  });
});

module.exports = router;
