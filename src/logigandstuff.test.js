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
  it("Already created item doesn't recreate", (done) => {
    AWS.mock('DynamoDB', 'getItem', function (params, callback){
      callback(null, {Item: {things: 'ohyeah'}});
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
});
