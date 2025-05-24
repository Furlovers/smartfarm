#!/usr/bin/env node
require('source-map-support/register');
const cdk = require('aws-cdk-lib');
const { IacStack } = require('../lib/iac-stack');

const app = new cdk.App();

const env = {
  account: process.env.AWS_ACCOUNT_ID,
  region: process.env.AWS_REGION
};

const stackName = 'SmartfarmStack';

new IacStack(app, stackName, {
  env: env
});