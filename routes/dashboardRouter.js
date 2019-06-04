var express = require('express');

const ConnectionService = require('../src/services/connectionService');
const ApplicationRepository = require('../src/repository/applicationRepository')

var router = express.Router();

router.get('/stats', async (req, res) => {
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

router.get('/stats/application/:id', async (req, res) => {
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

router.get('/application', async (req, res) => {
  const applications = ApplicationRepository.retrieveApplications().map(
    application => ({
      id: application
    })
  );
  res.send({
    applications
  });
});

module.exports = router;
