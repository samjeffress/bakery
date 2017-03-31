const monitoring = require('./monitoring.js');
const dataStore = require('./dataStore.js');

function createOrUpdate(stackName, endpoint, contactGroupName, tags) {
  return new Promise((resolve, reject) => {
    dataStore.doesEndpointExist(stackName, endpoint)
    .then(response => {
      console.log("checking if exists already")
      if (response.record){ 
        monitoring.
          confirmEndpointIsStillMonitored(response.record)
          .then(response => {
            console.log("Checking if still monitored...", response)
            if (response){
              return resolve({status: "Endpoint already monitored"});
            } else {
              return resolve({status: "fail, probably just recreate..."});
            }
          })
          .catch(e => console.log(e))
      } else {
        let foundContactGroupId = 0;
        monitoring
          .getContactGroupId(contactGroupName)
          .then(contactGroupId => {
            foundContactGroupId = contactGroupId;
            return monitoring.create(stackName,endpoint, contactGroupId, tags)
          })
          .then(endpointId => dataStore.recordEndpoint(
            stackName, 
            endpoint, 
            endpointId,
            contactGroupName,
            foundContactGroupId
          ))
          .then(() => resolve({status: "Endpoint created"}))
          .catch(innerError => reject(innerError))
      }
    })
    .catch(error => {
      return reject(error);
    })
  })
}

module.exports = {createOrUpdate};