const monitoring = require('./monitoring');
const dataStore = require('./dataStore');

function createOrUpdate(stackName, endpoint) {
	return new Promise((resolve, reject) => {
		dataStore.doesEndpointExist(stackName, endpoint)
		.then(response => {
			if (!response.record)
				return resolve({status: "Endpoint already monitored"});

			monitoring.create(stackName,endpoint)
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