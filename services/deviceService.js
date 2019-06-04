'use strict';

const AWS = require('aws-sdk');
const cloudwatchlogs = new AWS.CloudWatchLogs({ apiVersion: '2014-03-28', region: 'eu-central-1' });

const iot = new AWS.Iot({ apiVersion: '2015-05-28', region: 'eu-central-1' });
const iotdata = new AWS.IotData({
  endpoint: 'a1ge591avmlkp4-ats.iot.eu-central-1.amazonaws.com',
  apiVersion: '2015-05-28',
  region: 'eu-central-1'
});

const MAX_RECORDS = 10;

const parseThing = (payload) => {
  const thing = {};

  thing.clientId = payload.defaultClientId;
  thing.name = payload.thingName;
  thing.thingTypeName = payload.thingTypeName || '-';
  thing.attributes = payload.attributes;
  thing.version = payload.version || 0;
  thing.billingGroup = payload.billingGroup;

  return thing;
};

const addPrincipal = (thing) => {
  const params = {
    thingName: thing.name
  };

  return iot.listThingPrincipals(params).promise().then((data) => {
    const principals = (data && data.principals) ? data.principals : [];
    thing.principals = principals.map(principal => principal.split(':').pop());
    return thing;
  }).catch(() => thing);
};

const describeThingGroup = (thingGroup) => {
  const params = {
    thingGroupName: thingGroup.groupName
  };

  return iot.describeThingGroup(params).promise().then(data => {
    delete data.thingGroupArn;
    delete data.indexName;
    delete data.queryString;
    delete data.queryVersion;

    return data;
  }).catch(() => { });
};

const addThingGroups = (thing) => {
  const params = {
    thingName: thing.name
  };

  return iot.listThingGroupsForThing(params).promise()
    .then((data) => {
      return Promise.all(data.thingGroups.map(describeThingGroup));
    })
    .then((data) => {
      thing.thingGroups = data;
      return thing;
    })
    .catch(() => thing);
};

const addThingType = (thing) => {
  const params = {
    thingTypeName: thing.thingTypeName
  };
  return iot.describeThingType(params).promise().then((data) => {
    delete data.thingTypeArn;
    thing.thingType = data;

    return thing;
  }).catch(() => {
    thing.thingType = {};
    return thing;
  });
};

const addShadow = (thing) => {
  const params = {
    thingName: thing.name
  };

  return iotdata.getThingShadow(params).promise()
    .then((data) => {
      thing.shadow = JSON.parse(data.payload);

      return thing;
    }).catch(() => {
      thing.shadow = {};
      return thing;
    });
};


class DeviceService {

  findDevicesByThingGroup(thingGroupName) {
    const params = {
      thingGroupName: thingGroupName, /* required */
      maxResults: MAX_RECORDS,
      recursive: true
    };

    return iot.listThingsInThingGroup(params).promise();
  }

  findDevice(deviceId) {
    const params = {
      thingName: deviceId
    }

    return iot.describeThing(params).promise()
      .then(parseThing)
      .then(addPrincipal)
      .then(addThingType)
      .then(addShadow)
      .then(addThingGroups);
  }

  findJobs(deviceId) {
    const params = {
      thingName: deviceId
    };

    return iot.listJobExecutionsForThing(params).promise();
  }

  findIoTLogs(deviceId) {
    const params = {
      logGroupName: 'AWSIotLogsV2',
      filterPattern: `{ $.clientId = ${deviceId} }`,
      interleaved: true
    };

    return cloudwatchlogs.filterLogEvents(params).promise()
      .then((data) => {
        const logs = {};
        logs.events = data.events;

        return logs;
      });
  }
}

module.exports = DeviceService;
