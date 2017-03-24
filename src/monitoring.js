var requestPromise = require('request-promise');

const apiKey = process.env.STATUS_CAKE_API_KEY;
const username = process.env.STATUS_CAKE_USER;

function create(stackName,endpoint) {
	var options = {
	  method: 'PUT',
	  uri: 'https://app.statuscake.com/API/Tests/Update',
	  form: {
	  	WebsiteName: stackName,
	  	WebsiteURL: endpoint,
	  	CheckRate: 30,
	  	TestType: 'HTTP'
	  },
	  headers: {
	  	'API': apiKey,
	  	'Username': username,
	    'content-type': 'application/x-www-form-urlencoded',  // Set automatically
	    'Accept': 'application/json'
		}
	}

	return requestPromise(options)
		.then(jsonBody => {
			const body = JSON.parse(jsonBody);
			if (body.Success)
				return Promise.resolve(body.InsertID);
			return Promise.reject(body)
		})
		.catch(err => Promise.reject(err));
}

module.exports = {create};