import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dms from 'aws-cdk-lib/aws-dms'
import * as ec2 from 'aws-cdk-lib/aws-ec2'
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class DoorwayDatalakeStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const vpc = new ec2.Vpc(this, "temp-vpc", {
      ipAddresses: ec2.IpAddresses.cidr('10.0.0.0/16'),
    })


  }
}
