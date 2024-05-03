#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { DataLakeLambdaStack } from '../lib/doorway-datalake-lambda-stack';
import { DataLakeDMSStack } from '../lib/doorway-datalake-dms-stack';
import { DmsVpcRoleStack } from 'dms-patterns';

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};


const app = new cdk.App();
new DataLakeLambdaStack(app, 'DataLakeLambdaStack', {
  env:env
});
new DmsVpcRoleStack(app, 'DmsVpcRoleStack');
new DataLakeDMSStack(app, 'DataLakeLambdaStack', {
  env:env
});