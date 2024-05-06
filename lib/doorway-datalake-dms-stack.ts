import * as cdk from "aws-cdk-lib";
import {
  CfnReplicationInstance,
  CfnReplicationSubnetGroup,
} from "aws-cdk-lib/aws-dms";
import { Vpc } from "aws-cdk-lib/aws-ec2";
import { DatabaseSecret } from "aws-cdk-lib/aws-rds";
import { Construct } from "constructs";
import * as ssm from 'aws-cdk-lib/aws-ssm'

export class DataLakeDMSStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const secret = DatabaseSecret.fromSecretAttributes(this, "secret", {
      secretCompleteArn:
      ssm.StringParameter.fromStringParameterName(this, 'dbSecret', '/doorway/testdb/dbSecret').stringValue,
    });
    const vpcId = cdk.Fn.importValue("vpcId");
    const vpc = Vpc.fromVpcAttributes(this, "Vpc", {
      vpcId:  ssm.StringParameter.fromStringParameterName(this, 'vpcId', '/doorway/testdb/vpcId').stringValue,
      availabilityZones: this.availabilityZones
    })
    const subnetIds: string[] = [];

    vpc.publicSubnets.forEach((subnet) => subnetIds.push(subnet.subnetId));

    const replicationSubnetGroup = new CfnReplicationSubnetGroup(
      this,
      "ReplicationSubnets",
      {
        subnetIds: subnetIds,
        replicationSubnetGroupDescription: 'Subnets used by DMS instance',
        replicationSubnetGroupIdentifier: 'DMSSubnets'
      },
    );

    const replicationInstance = new CfnReplicationInstance(
      this,
      "ReplicationInstance",
      {
        replicationInstanceClass: "dms.t2.micro",
        publiclyAccessible: false,
        vpcSecurityGroupIds: ["sg-023f8c31e23696e1c"],
        replicationInstanceIdentifier: 'DMSSubnets'
      },
    );
  }
}
