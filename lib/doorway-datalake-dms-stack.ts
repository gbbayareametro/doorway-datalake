import * as cdk from "aws-cdk-lib";
import {
  CfnReplicationInstance,
  CfnReplicationSubnetGroup,
} from "aws-cdk-lib/aws-dms";
import { Vpc } from "aws-cdk-lib/aws-ec2";
import { DatabaseSecret } from "aws-cdk-lib/aws-rds";
import { Construct } from "constructs";
interface DMSStackProps extends cdk.StackProps {
  replicationSubnetGroup: CfnReplicationSubnetGroup;
}
export class DataLakeDMSStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: DMSStackProps) {
    super(scope, id, props);
    const secret = DatabaseSecret.fromSecretAttributes(this, "secret", {
      secretCompleteArn:
        "arn:aws:secretsmanager:us-east-2:364076391763:secret:DoorwayTestDbStackSecretCC3-dUp1tGcD6zhb-D6p5UJ",
    });

    const replicationInstance = new CfnReplicationInstance(
      this,
      "ReplicationInstance",
      {
        replicationInstanceClass: "dms.t2.micro",
        publiclyAccessible: false,
        vpcSecurityGroupIds: ["sg-023f8c31e23696e1c"],
        replicationSubnetGroupIdentifier:
          props.replicationSubnetGroup.replicationSubnetGroupIdentifier,
      },
    );
  }
}