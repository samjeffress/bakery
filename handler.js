'use strict';
var logicAndStuff = require('./src/logicandstuff.js');

function generateResponse(success, error) {
  return {
    statusCode: success ? 200 : 500,
    headers: {
      "content-type" : "application/json"
    },
    body: success ? JSON.stringify(success) : JSON.stringify(error)
  };
}

module.exports.createOrUpdate = (event, context, callback) => {
  var body = JSON.parse(event.body);
  console.log(body)
  logicAndStuff.createOrUpdate(body.stackName, body.endpoint, body.contactGroup, body.tags)
    .then(success => {
      const response = generateResponse(success, null);
      callback(null, response);
    })
    .catch(error => {
      console.log(error);
      const response = generateResponse(null, error);
      callback(null, response);
    })
};
