const assert = require('assert');
const nock = require('nock');
var AWS = require('aws-sdk-mock');
const logicandstuff = require('./logicandstuff');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const stackName = 'stackName';
const endpoint = 'endpoint';
const contactGroupName = 'contactGroupName';
const tags = "tags,tags2";

describe("Logic tests", () => {
  it("Already created updates", (done) => {
    AWS.restore();
    nock.cleanAll();

    const testId = 123;
    const storedData = {
      monitoringId: testId, 
      stackName: 'ohyeah', 
      endpoint: 'endpoint',
      contactGroupName,
      contactGroupId: 888888
    };
    AWS.mock('DynamoDB', 'getItem', function (params, callback){
      callback(null, {Item: storedData});
    });

    AWS.mock('DynamoDB', 'putItem', function (params, callback){
      callback(null, {});
    });

    nock('https://app.statuscake.com/API').get('/ContactGroups/').reply(200, [
      {"GroupName": "frank", "ContactID": 222}, 
      {"GroupName": contactGroupName, "ContactID": storedData.contactGroupId}
    ]);

    nock('https://app.statuscake.com/API/Tests').put('/Update', (body) => {
      return body.ContactGroup === `${storedData.contactGroupId}`
      && body.TestTags === tags
      && body.TestID === `${testId}`;
    }).reply(200, {Success: true, InsertID: 123});


    logicandstuff.createOrUpdateMonitoring(stackName, endpoint, contactGroupName, tags)
      .then(response => {
        assert.equal(response.status, "Endpoint updated");
        done();
      })
      .catch(error => done(error));
  })

  it("Already created but different details updates", (done) => {
    AWS.restore();
    nock.cleanAll();

    const testId = 123;
    const contactGroupId = 888888;
    const newTags = "abc,onetwothree";
    const storedData = {
      monitoringId: testId, 
      stackName: 'ohyeah', 
      endpoint: 'endpoint',
      contactGroupName,
      contactGroupId,
      tags: "one,two"
    };
    AWS.mock('DynamoDB', 'getItem', function (params, callback){
      callback(null, {Item: storedData});
    });

    AWS.mock('DynamoDB', 'putItem', function (params, callback){
      callback(null, {});
    });

    nock('https://app.statuscake.com/API').get('/ContactGroups/').reply(200, [
      {"GroupName": "frank", "ContactID": 222}, 
      {"GroupName": contactGroupName, "ContactID": contactGroupId}
    ]);

    nock('https://app.statuscake.com/API/Tests').put('/Update', (body) => {
      return body.ContactGroup === `${contactGroupId}`
      && body.TestTags === newTags
      && body.TestID === `${testId}`;
    }).reply(200, {Success: true, InsertID: 123});

    logicandstuff.createOrUpdateMonitoring(stackName, endpoint, contactGroupName, newTags)
      .then(response => {
        assert.equal(response.status, "Endpoint updated");
        done();
      })
      .catch(error => done(error));
  })
  
  it("New item is created without contact group or tags", (done) => {
    AWS.restore();
    nock.cleanAll();

    AWS.mock('DynamoDB', 'getItem', function (params, callback){
      callback(null, {});
    });

    AWS.mock('DynamoDB', 'putItem', function (params, callback){
      callback(null, {});
    });


    const contactIdFound = 444444;
    nock('https://app.statuscake.com/API').get('/ContactGroups/').reply(200, [
      {"GroupName": "frank", "ContactID": 222}, 
      {"GroupName": contactGroupName, "ContactID": contactIdFound}
    ]);


    nock('https://app.statuscake.com/API/Tests').put('/Update').reply(200, {Success: true, InsertID: 123});

    logicandstuff.createOrUpdateMonitoring(stackName, endpoint, "", "")
      .then(response => {
        assert.equal(response.status, "Endpoint created");
        done();
      })
      .catch(error => done(error));
  })

  it("New item is created with contact group or tags", (done) => {
    AWS.restore();
    nock.cleanAll();

    AWS.mock('DynamoDB', 'getItem', function (params, callback){
      callback(null, {});
    });

    AWS.mock('DynamoDB', 'putItem', function (params, callback){
      callback(null, {});
    });

    const contactIdFound = 444444;
    nock('https://app.statuscake.com/API').get('/ContactGroups/').reply(200, [
      {"GroupName": "frank", "ContactID": 222}, 
      {"GroupName": contactGroupName, "ContactID": contactIdFound}
    ]);
    nock('https://app.statuscake.com/API/Tests').put('/Update', (body) => {
      return body.ContactGroup === `${contactIdFound}` 
      && body.TestTags === tags;
    }).reply(200, {Success: true, InsertID: 123});

    logicandstuff.createOrUpdateMonitoring(stackName, endpoint, contactGroupName, tags)
      .then(response => {
        assert.equal(response.status, "Endpoint created");
        done();
      })
      .catch(error => done(error));
  })
});
