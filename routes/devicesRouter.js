const express = require('express');
const router = express.Router();
const DeviceService = require('../services/deviceService');

const deviceService = new DeviceService();

/* GET devices. */
router.get('/', async (req, res) => {
  try {
    const query = req.query;

    if (!query.thingGroup) throw new Error('The thing group was not specified');
    const thingGroup = query.thingGroup;

    const data = await deviceService.findDevicesByThingGroup(thingGroup);
    res.send(data.things);
  } catch (err) {
    res.send({ message: err.message })
  }
});

router.get('/:deviceId', async (req, res) => {
  try {
    const device = await deviceService.findDevice(req.params.deviceId);
    res.send(device);
  } catch (err) {
    res.send({ message: err.message });
  }
});

router.get('/:deviceId/jobsExecution', async (req, res) => {
  try {
    const jobs = await deviceService.findJobs(req.params.deviceId);
    res.send(jobs);
  } catch (err) {
    res.send({ message: err.message });
  }
});

router.get('/:deviceId/logs', async (req, res) => {
  try {
    const logs = await deviceService.findIoTLogs(req.params.deviceId);
    res.send(logs);
  } catch (err) {
    res.send({ message: err.message });
  }
});

router.get('/:deviceId/detail', async (req, res) => {
  console.log(`Loading device detail for: ${req.params.deviceId}`);
  const device = await deviceService.findDevice(req.params.deviceId);
  const jobs = await deviceService.findJobs(req.params.deviceId);
  const logs = await deviceService.findIoTLogs(req.params.deviceId);

  res.render("device", { title: "Detail Device 2", device: device, logs: logs, jobs: jobs });
});

module.exports = router;
