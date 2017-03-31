[![Build Status](https://travis-ci.org/samjeffress/bakery.svg?branch=master)](https://travis-ci.org/samjeffress/bakery)
# Bakery
Serverless function to manage your [Status Cake](https://www.statuscake.com/) tests. 

## Why?
Because Status Cake's API isn't idempotent (it'll keep creating new tests for the same endpoint), so Bakery keeps track of what you have created and can update tests too.

## How do I run this?
* Clone the repo [git@github.com:samjeffress/bakery.git](git@github.com:samjeffress/bakery.git) or `sls install -u https://github.com/samjeffress/bakery`
* Setup your Status Cake variables in your environment variables:
  - `STATUS_CAKE_API_KEY`
  - `STATUS_CAKE_USER`
* Make sure your AWS Credentials are setup - [serverless aws credentials](https://serverless.com/framework/docs/providers/aws/guide/credentials/) 
* `sls deploy` 

Hooray!


You probably want to add an api key to your API Gateway service.

To add a new check:

	POST to /statuscheck
	{"stackName":"cats", "endpoint":"https://google.com?cats"}