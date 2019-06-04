const AWS = require('aws-sdk');

const ApplicationRepository = require('../repository/applicationRepository');
const AWSService = require('./awsService');

class ConnectionService {
  constructor() {
    this.iot = AWSService.retrieveIoTClient();
  }

  async countAllDevices(applicationId = '') {
    const applicationIds = applicationId ? [applicationId] : ApplicationRepository.retrieveApplications();
    const applicationQuery = applicationIds.map(applicationId => `attributes.applicationGuid: ${applicationId}`)
      .join(' OR ');
    const queryString = `${applicationQuery}`;
    const queryParams = {
      queryString
    };
    try {
      const stats = await this.iot.getStatistics(queryParams).promise();
      return stats.statistics.count;
    } catch (err) {
      console.log(err);
      return 0;
    }
  }

  async countConnectedDevices() {
    const applicationIds = ApplicationRepository.retrieveApplications();
    const applicationQuery = applicationIds.map(applicationId => `attributes.applicationGuid: ${applicationId}`)
      .join(' OR ');
    const queryString = `connectivity.connected:true AND (${applicationQuery})`;
    const queryParams = {
      queryString
    };
    try {
      const stats = await this.iot.getStatistics(queryParams).promise();
      return stats.statistics.count;
    } catch (err) {
      console.log(err);
      return 0;
    }
  }

  async countConnectedDevicesByApp(applicationId) {
    const applicationQuery = `attributes.applicationGuid: ${applicationId}`;
    const queryString = `connectivity.connected:true AND ${applicationQuery}`;
    const queryParams = {
      queryString
    };
    try {
      const stats = await this.iot.getStatistics(queryParams).promise();
      return stats.statistics.count;
    } catch (err) {
      console.log(err);
      return 0;
    }
  }

  async isDeviceConnected(hsdpId) {
    const thingQuery = `thingName: ${hsdpId}`;
    const queryString = `connectivity.connected:true AND ${thingQuery}`;
    const queryParams = {
      queryString
    };
    try {
      const stats = await this.iot.getStatistics(queryParams).promise();
      return stats.statistics.count > 0;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}

module.exports = ConnectionService;
