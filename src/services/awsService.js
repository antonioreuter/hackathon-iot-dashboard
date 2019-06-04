const AWS = require('aws-sdk');

class AWSService {
  static retrieveIoTClient() {
    return new AWS.Iot({ region: 'eu-central-1', apiVersion: '2015-05-28' });
  }
}

module.exports = AWSService;
