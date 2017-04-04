const monitoring = require('./monitoring.js');
const dataStore = require('./dataStore.js');

function createOrUpdateMonitoring(stackName, endpoint, contactGroupName, tags, monitoringId) {
  return new Promise((resolve, reject) => {
    dataStore.doesEndpointExist(stackName, endpoint)
    .then(response => {
      console.log("checking if exists already")
      if (response.record){ 
        console.log('already exists', response)
        createOrUpdate(stackName, endpoint, contactGroupName, tags, response.record.monitoringId)
        .then(() => resolve({status: "Endpoint updated"}))
        .catch(e => reject(e))
      } else {
        return resolve(createOrUpdate(stackName, endpoint, contactGroupName, tags));
      }
    })
    .catch(error => {
      return reject(error);
    })
  })
}

function createOrUpdate(stackName, endpoint, contactGroupName, tags, statusCakeId) {
  let foundContactGroupId = 0;
  return monitoring.getContactGroupId(contactGroupName)
  .then(contactGroupId => {
    foundContactGroupId = contactGroupId;
    console.log('found contact group')
    return monitoring.createOrUpdate(stackName, endpoint, contactGroupId, tags, statusCakeId)
  })
  .then(endpointId => {
    console.log("endpoint", endpointId)
    return dataStore.recordEndpoint(
      stackName, 
      endpoint, 
      endpointId,
      contactGroupName,
      foundContactGroupId,
      tags
    )
  })
  .then(things => {
    console.log('things', things)
    return Promise.resolve({status: "Endpoint created"})
  })
}

module.exports = {createOrUpdateMonitoring};
