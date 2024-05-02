import { Stack, StackProps } from "aws-cdk-lib";

import { Construct } from "constructs";
import { RDSDBInstance } from "./resources/database";
import { LambdaInstance } from "./resources/lambda";
import { VpcInstance } from "./resources/vpc";

// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class DoorwayDatalakeStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    const vpc = new VpcInstance(this, id).create(`${id}-vpc`);
    const db = new RDSDBInstance(this, id, props).create(`${id}-db`, vpc);
    const lambda = new LambdaInstance(this, id, props).create(
      `${id}-lambda`,
      db.vpc,
    );
  }
}
