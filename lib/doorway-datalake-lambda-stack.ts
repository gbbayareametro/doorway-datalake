import { Stack, StackProps, Fn } from "aws-cdk-lib";

import { Construct } from "constructs";
import { LambdaInstance } from "./resources/lambda";

import { Vpc } from "aws-cdk-lib/aws-ec2";

// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class DataLakeLambdaStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    const vpc = Vpc.fromLookup(this, 'Vpc', {
      vpcId: 'vpc-047536235f57fd54e'
    })
    const lambda = new LambdaInstance(this, id, props).create(
      `${id}-lambda`,
      vpc,
    );
  }
}


