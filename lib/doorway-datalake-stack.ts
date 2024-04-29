import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dms from 'aws-cdk-lib/aws-dms'
import * as ec2 from 'aws-cdk-lib/aws-ec2'
import * as rds from 'aws-cdk-lib/aws-rds'
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class DoorwayDatalakeStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const vpc = new ec2.Vpc(this, "temp-vpc", {
      ipAddresses: ec2.IpAddresses.cidr('10.0.0.0/16'),
    })
    const sg = new ec2.SecurityGroup(this, 'InboundPostgres', { vpc })
    sg.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.POSTGRES, "Allow PostgresPort")

    const instance = new rds.DatabaseInstance(this, "temp-rds", {
      engine: rds.DatabaseInstanceEngine.POSTGRES,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.MICRO),
      credentials: rds.Credentials.fromGeneratedSecret('syscdk'),
      vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS
      },
      securityGroups: [sg]
    })






  }
}
