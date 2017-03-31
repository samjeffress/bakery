var requestPromise = require('request-promise');
var R = require('ramda');

const apiKey = process.env.STATUS_CAKE_API_KEY || 'apiKey';
const username = process.env.STATUS_CAKE_USER || 'username';

function create(stackName,endpoint,contactGroupId,tags) {
  var options = {
    method: 'PUT',
    uri: 'https://app.statuscake.com/API/Tests/Update',
    form: {
      WebsiteName: stackName,
      WebsiteURL: endpoint,
      CheckRate: 30,
      TestType: 'HTTP',
      ContactGroup: contactGroupId,
      Tags: tags
    },
    headers: {
      'API': apiKey,
      'Username': username,
      'content-type': 'application/x-www-form-urlencoded',  // Set automatically
      'Accept': 'application/json'
    }
  } 
  console.log(options);

  return requestPromise(options)
    .then(jsonBody => {
      console.log('jsonBody', jsonBody)
      const body = JSON.parse(jsonBody);
      if (body.Success)
        return Promise.resolve(body.InsertID);
      return Promise.reject(body)
    })
    .catch(err => {
      console.log(err);
      return Promise.reject(err);
    });
}


function getContactGroupId(contactGroupName){
	console.log('contactGroupName', contactGroupName)
  if (!contactGroupName)
    return Promise.resolve(0);

  var options = {
    method: 'GET',
    uri: 'https://app.statuscake.com/API/ContactGroups/',
    headers: {
      'API': apiKey,
      'Username': username,
      'Accept': 'application/json'
    }
  }

  return requestPromise(options)
    .then(jsonBody => {
      const body = JSON.parse(jsonBody);
      console.log(body);
      const foundContactGroup = R.find(R.propEq('GroupName', contactGroupName))(body);
      console.log('Found contact group', foundContactGroup)
      if (foundContactGroup)
        return Promise.resolve(foundContactGroup.ContactID);
      return Promise.reject({error: `No contact group found for ${contactGroupName}`})
    })
    .catch(err => Promise.reject(err));
}

function confirmEndpointIsStillMonitored(recordedEndpoint){
  var options = {
    method: 'GET',
    uri: `https://app.statuscake.com/API/Tests/Details/?TestID=${recordedEndpoint.MonitoringId}`,
    headers: {
      'API': apiKey,
      'Username': username,
      'Accept': 'application/json'
    }
  }

  return requestPromise(options)
    .then(jsonBody => {
      const body = JSON.parse(jsonBody);
      const response = 
        body.WebsiteName === recordedEndpoint.StackName &&
        body.WebsiteURL === recordedEndpoint.Endpoint &&
        body.ContactGroup === recordedEndpoint.ContactGroupName &&
        body.ContactID === recordedEndpoint.ContactGroupId; 
      return Promise.resolve(response);
    })
    .catch(err => Promise.reject(err));
}

module.exports = {create, getContactGroupId, confirmEndpointIsStillMonitored};