const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');

var iot = new AWS.Iot({apiVersion: '2015-05-28', region: 'eu-central-1'});

const MAX_RECORDS = 10;

const parseThing = (payload) => {
  const thing = {};

  thing.clientId = payload.defaultClientId;
  thing.name = payload.thingName;
  thing.type = payload.thingTypeName || '-';
  thing.attributes = payload.attributes;
  thing.version = payload.version || 0;
  thing.billingGroup = payload.billingGroup;

  return thing;
};
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

  return iot.listThingsInThingGroup(params).promise().then(data => res.send(data.things)).catch(err => res.send({ message: err.message }));
});

router.get('/:deviceId', (req, res) => {
  const deviceId = req.params.deviceId;

  console.log(`Describing device: ${deviceId}`);

  const params = {
    thingName: deviceId
  }

  return iot.describeThing(params).promise().then(data => res.send(parseThing(data))).catch(err => res.send({ message: err.message }));
});

module.exports = router;
