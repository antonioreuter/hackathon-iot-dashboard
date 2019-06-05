const AWSService = require('../services/awsService');
const ApplicationRepository = require('../repository/applicationRepository');


class DeviceRepository {
  constructor() {
    this.iot = AWSService.retrieveIoTClient();
  }

  async getAll() {
    const applicationIds = ApplicationRepository.retrieveApplications();
    const applicationQuery = applicationIds.map(applicationId => `attributes.applicationGuid: ${applicationId}`)
      .join(' OR ');
    const queryString = `${applicationQuery}`;
    const queryParams = {
      queryString
    };
    try {
      let nextToken = null;
      const result = [];
      do {
        const params = { ...queryParams, nextToken };
        const data = await this.iot.searchIndex(params).promise();
        nextToken = data.nextToken;
        result.push(...data.things.map(thing => thing.thingName));
      } while (nextToken);
      return result;
    } catch (err) {
      console.log(err);
      return 0;
    }
  }
};

module.exports = DeviceRepository;
