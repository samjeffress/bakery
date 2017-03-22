var requestPromise = require('request-promise');

const apiKey = "cats";
const username = "usermcuserface";

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
	  	'Username': username
	    'content-type': 'application/x-www-form-urlencoded'  // Set automatically
		}
	}

	return requestPromise(options)
		.then(body => {
			if (body.Success)
				return Promise.resolve(body.InsertID);
			return Promise.reject(body)
		})
		.catch(err => reject(err));
}

module.exports = {create};