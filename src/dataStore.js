var AWS = require("aws-sdk");
var dynamo = new AWS.DynamoDB();
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
  return new Promise((resolve, reject) => {
    var params = createParams(stackName, endpoint); 
    dynamo.getItem(params, (err, data) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      if (data) {
        console.log('retrieved', data);
        return resolve(data);
      }
    })
  });
}

function putItem(stackName, endpoint) {
  return new Promise((resolve, reject) => {
    var params = createParams(stackName, endpoint); 
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
      .then(data => resolve({record: data.Item})
      .catch(err => reject(err));
    })
  });
}

var recordEndpoint = function(stackName, endpoint) {
  console.log('creating records for ', {stackName, endpoint});
  return putItem(stackName, endpoint);
}

module.exports = {doesEndpointExist, recordEndpoint};
