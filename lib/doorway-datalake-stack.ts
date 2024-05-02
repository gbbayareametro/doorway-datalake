import { Stack, StackProps } from "aws-cdk-lib";

import { Construct } from "constructs";
import { RDSDBInstance } from "../../doorway-test-db/lib/resources/database";
import { LambdaInstance } from "./resources/lambda";
import { VpcInstance } from "../../doorway-test-db/lib/resources/vpc";
import { Vpc } from "aws-cdk-lib/aws-ec2";

// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class DoorwayDatalakeStack extends Stack {

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    const vpc = Vpc.fromLookup(this,"VPC",{
       vpcId: "vpc-0533af7fdb40791a7",
    })
    const lambda = new LambdaInstance(this, id, props).create(
      `${id}-lambda`,
      vpc
    );
  }
}
