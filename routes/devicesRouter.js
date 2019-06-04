const express = require('express');
const router = express.Router();
const DeviceService = require('../services/deviceService');

const deviceService = new DeviceService();

/* GET devices. */
router.get('/', (req, res) => {
  const query = req.query;

  if (!query.thingGroup) throw new Error('The thing group was not specified');
  const thingGroup = query.thingGroup;

  return deviceService.findDevicesByThingGroup(thingGroup)
    .then(data => res.send(data.things)).catch(err => res.send({ message: err.message }));
});

router.get('/:deviceId', (req, res) => {
  const deviceId = req.params.deviceId;

  return deviceService.findDevice(deviceId)
    .then(data => res.send(data))
    .catch(err => res.send({ message: err.message }));
});

router.get('/:deviceId/jobsExecution', (req, res) => {
  return deviceService.findJobs(req.params.deviceId)
    .then(data => res.send(data))
    .catch(err => res.send({ message: err.message }));
});

router.get('/:deviceId/logs', (req, res) => {
  return deviceService.findIoTLogs(req.params.deviceId)
    .then(logs => res.send(logs))
    .catch(err => res.send({ message: err.message}));
});

router.get('/:deviceId/detail', (req, res) => {
  console.log(`Loading device detail for: ${req.params.deviceId}`);
  return deviceService.findDevice(req.params.deviceId).then((device) => {
    res.render("device", { title: "Detail Device", device: device });
  });
});

module.exports = router;
