const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');

const iot = new AWS.Iot({apiVersion: '2015-05-28', region: 'eu-central-1'});
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
  });
};


const addThingType = (thing) => {
  const params = {
    thingTypeName: thing.thingTypeName
  };
  return iot.describeThingType(params).promise().then((data) => {
    delete data.thingTypeArn;
    thing.thingType = data;

    return thing;
  });
}

const addShadow = (thing) => {
  const params = {
    thingName: thing.name
  };

  return iotdata.getThingShadow(params).promise()
    .then((data) => {
      thing.shadow = JSON.parse(data.payload);

      return thing;
    });
  }




/* GET devices. */
router.get('/', (req, res) => {
  const query = req.query;

  if (!query.thingGroup) throw new Error('The thing group was not specified');
  const thingGroup = query.thingGroup;
  const currentPage = query.page || 1;

  const params = {
    thingGroupName: thingGroup, /* required */
    maxResults: MAX_RECORDS,
    recursive: true
  };

  console.log(`Params: ${JSON.stringify(params)}`);

  return iot.listThingsInThingGroup(params).promise()
  .then(data => res.send(data.things)).catch(err => res.send({ message: err.message }));
});

router.get('/:deviceId', (req, res) => {
  const deviceId = req.params.deviceId;

  console.log(`Describing device: ${deviceId}`);

  const params = {
    thingName: deviceId
  }

  return iot.describeThing(params).promise()
  .then(parseThing)
  .then(addPrincipal)
  .then(addThingType)
  .then(addShadow)
  .then(data => res.send(data))
  .catch(err => res.send({ message: err.message }));
});

module.exports = router;
