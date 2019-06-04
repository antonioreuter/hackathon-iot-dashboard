const AWSService = require('../services/awsService');

class DeviceRepository {
  constructor() {
    this.iot = AWSService.retrieveIoTClient();
  }

  getByHSDPId(hsdpId) {

  }
};

module.exports = DeviceRepository;
