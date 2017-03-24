# Bakery

Serverless function to manage your [Status Cake](https://www.statuscake.com/) tests. 

## How do I run this?
* Clone the repo [git@github.com:samjeffress/bakery.git](git@github.com:samjeffress/bakery.git).
* Setup your Status Cake variables in the serverless.yml
* Make sure your AWS Credentials are setup - [serverless aws credentials](https://serverless.com/framework/docs/providers/aws/guide/credentials/) 
* `sls deploy` 

Hooray!


You probably want to add an api key to your API Gateway service.

To add a new check:

	POST to /statuscheck
	{"stackName":"cats", "endpoint":"https://google.com?cats"}