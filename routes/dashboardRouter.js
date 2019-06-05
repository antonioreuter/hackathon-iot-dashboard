const express = require('express');
const path = require('path');

const ConnectionService = require('../src/services/connectionService');
const ApplicationRepository = require('../src/repository/applicationRepository')
const DeviceRepository = require('../src/repository/deviceRepository')

const router = express.Router();

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

router.get('/stats/thing/:id', async (req, res) => {
  const thingId = req.params.id;
  const connectionService = new ConnectionService();
  const connectionStatus = await connectionService.isDeviceConnected(thingId);
  res.send({
    isConnected: connectionStatus
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

router.get('/thingnames', async (req, res) => {
  const deviceRepository = new DeviceRepository();
  const thingNames = await deviceRepository.getAll();
  res.send(thingNames);
});

module.exports = router;
