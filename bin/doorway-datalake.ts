import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { DataLakeLambdaStack } from '../lib/doorway-datalake-lambda-stack';
import { DataLakeDMSStack } from '../lib/doorway-datalake-dms-stack';
import { DmsVpcRoleStack } from 'dms-patterns';
import { DataLakeDMSSubnetGroupStack } from '../lib/doorway-datalake-dms-sg-stack';
import { CfnReplicationSubnetGroup } from 'aws-cdk-lib/aws-dms';
import { DataLakeETLStack } from '../lib/doorway-datalake-etl-stack';

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION
};

const app = new cdk.App();
new DataLakeLambdaStack(app, 'DataLakeLambdaStack', {
  env: env
});
new DmsVpcRoleStack(app, 'DmsVpcRoleStack');
const subnetGroupStack = new DataLakeDMSSubnetGroupStack(
  app,
  'SubnetGroupStack'
);

new DataLakeDMSStack(app, 'DataLakeDMSStack', {
  env: env,
  replicationSubnetGroup: subnetGroupStack.replicationSubnetGroup
});
new DataLakeETLStack(app, 'ETLStack', {
  env: env
})