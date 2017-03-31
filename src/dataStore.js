var AWS = require("aws-sdk");

var tableName = "bakery";

function createParams(stackName, endpoint) {
  return {
    TableName: tableName,
    Item: {
      "StackName": {S: stackName},
      "Endpoint": {S: endpoint}
    }
  };
}

function getItem(stackName, endpoint) {
  var dynamo = new AWS.DynamoDB();
  return new Promise((resolve, reject) => {
    var params = {
      TableName: tableName,
      Key: {
        "StackName": {S: stackName},
        "Endpoint": {S: endpoint}
      }
    };
    dynamo.getItem(params, (err, data) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      console.log('retrieved', data);
      return resolve(data); 
    })
  });
}

function putItem(stackName, endpoint, monitoringId, contactGroupName, contactGroupId) {
  var dynamo = new AWS.DynamoDB();
  return new Promise((resolve, reject) => {
    var params = createParams(stackName, endpoint); 
    console.log(monitoringId);
    params.Item.MonitoringId = {N: `${monitoringId}`};
    params.Item.ContactGroupName = {S: contactGroupName};
    params.Item.ContactGroupId = {S: contactGroupId};
    dynamo.putItem(params, (err, data) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      if (data) {
        console.log('created', data);
        return resolve(data);
      }
    })
  });
}

const doesEndpointExist = function(stackName, endpoint) {
  return new Promise((resolve, reject) => {
    getItem(stackName, endpoint)
      .then(data => resolve({record: data.Item}))
      .catch(err => reject(err));
    })
};


var recordEndpoint = function(stackName, endpoint, monitoringId) {
  console.log('creating records for ', {stackName, endpoint});
  return putItem(stackName, endpoint, monitoringId);
}

module.exports = {doesEndpointExist, recordEndpoint};
