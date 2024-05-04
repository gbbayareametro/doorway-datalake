import { Stack, StackProps } from "aws-cdk-lib";
import { CfnReplicationInstance } from "aws-cdk-lib/aws-dms";
import { DatabaseSecret } from "aws-cdk-lib/aws-rds";
import { Construct } from "constructs";

export class DataLakeDMSStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    const secret = DatabaseSecret.fromSecretAttributes(this, "secret", {
      secretCompleteArn:
        "arn:aws:secretsmanager:us-east-2:364076391763:secret:DoorwayTestDbStackSecretCC3-dUp1tGcD6zhb-D6p5UJ",
    });
    const replicationInstance = new CfnReplicationInstance(this,'ReplicationInstance',{
        replicationInstanceClass: 'dms.t2.micro',
        publiclyAccessible: false,
        vpcSecurityGroupIds:['sg-023f8c31e23696e1c']



    })

  }
}
