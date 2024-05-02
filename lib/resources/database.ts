import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as rds from "aws-cdk-lib/aws-rds";
import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { VpcInstance } from "./vpc";
export class RDSDBInstance {
  scope: cdk.Stack;
  id: string;
  props?: cdk.StackProps;

  constructor(scope: cdk.Stack, id: string, props?: cdk.StackProps) {
    this.scope = scope;
    this.id = id;
    this.props = props;
  }
  create(name: string, vpc: ec2.Vpc) {
    const sg = new ec2.SecurityGroup(this.scope, `${this.id}-InboundPostgres`, {
      vpc,
    });
    sg.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.POSTGRES,
      "Allow PostgresPort",
    );

    const instance = new rds.DatabaseInstance(this.scope, this.id, {
      engine: rds.DatabaseInstanceEngine.POSTGRES,
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.BURSTABLE3,
        ec2.InstanceSize.MICRO,
      ),
      credentials: rds.Credentials.fromGeneratedSecret("syscdk"),
      vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
      },
      securityGroups: [sg],
    });
    return instance;
  }
}
