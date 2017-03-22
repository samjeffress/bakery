'use strict';
var logicAndStuff = require('./src/logicAndStuff');

module.exports.createOrUpdate = (event, context, callback) => {
  var body = JSON.parse(event.body);
  logicAndStuff.createOrUpdate(body.stackName, body.endpoint)
    .then(success => {
      console.log("wrote something to dynamo");
      const response = {
        statusCode: 200,
        headers: {
          "content-type" : "application/json"
        },
        body: JSON.stringify(success)
      };
      callback(null, response);
    })
    .catch(error => {
      console.log('catching an error...');
      console.log(error);
      const response = {
        statusCode: 500,
        headers: {
          "content-type" : "application/json"
        },
        body: JSON.stringify(error)
      };
      callback(null, response);
    })
};
