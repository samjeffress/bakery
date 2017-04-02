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
  it("Already created confirms still exists", (done) => {
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

    nock('https://app.statuscake.com/API').get(`/Tests/Details/?TestID=${testId}`).reply(200, {
      "TestID": testId,
      "TestType": "HTTP",
      "WebsiteName": storedData.stackName, 
      "WebsiteURL": storedData.endpoint,
      "ContactGroup": contactGroupName,
      "ContactID": storedData.contactGroupId, 
      "DoNotFind": false
    });

    logicandstuff.createOrUpdate(stackName, endpoint, contactGroupName, tags)
      .then(response => {
        assert.equal(response.status, "Endpoint already monitored");
        done();
      })
      .catch(error => done(error));
  })

  it("New item is created without contact group or tags", (done) => {
    AWS.restore();
    AWS.mock('DynamoDB', 'getItem', function (params, callback){
      callback(null, {});
    });

    AWS.mock('DynamoDB', 'putItem', function (params, callback){
      callback(null, {});
    });

    expected = nock('https://app.statuscake.com/API/Tests').put('/Update').reply(200, {Success: true, InsertID: 123});

    logicandstuff.createOrUpdate(stackName, endpoint, "", "")
      .then(response => {
        assert.equal(response.status, "Endpoint created");
        done();
      })
      .catch(error => done(error));
  })

  it("New item is created with contact group or tags", (done) => {
    AWS.restore();
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
      && body.Tags === tags;
    }).reply(200, {Success: true, InsertID: 123});

    logicandstuff.createOrUpdate(stackName, endpoint, contactGroupName, tags)
      .then(response => {
        assert.equal(response.status, "Endpoint created");
        done();
      })
      .catch(error => done(error));
  })
});
