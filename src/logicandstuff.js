const monitoring = require('./monitoring.js');
const dataStore = require('./dataStore.js');

function createOrUpdate(stackName, endpoint, contactGroupName, tags) {
  return new Promise((resolve, reject) => {
    dataStore.doesEndpointExist(stackName, endpoint)
    .then(response => {
      if (response.record) // TODO: Check that it still exists
        return resolve({status: "Endpoint already monitored"});

      monitoring
        .getContactGroupId(contactGroupName)
        .then(contactGroupId => monitoring.create(stackName,endpoint, contactGroupId, tags))
        .then(endpointId => dataStore.recordEndpoint(stackName, endpoint, endpointId))
        .then(() => resolve({status: "Endpoint created"}))
        .catch(innerError => reject(innerError))
      })
    .catch(error => {
      return reject(error);
    })
  })
}

module.exports = {createOrUpdate};