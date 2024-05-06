import * as cdk from "aws-cdk-lib";
import {
  CfnReplicationInstance,
  CfnReplicationSubnetGroup,
} from "aws-cdk-lib/aws-dms";
import { Construct } from "constructs";

export class DataLakeDMSSubnetGroupStack extends cdk.Stack {
  replicationSubnetGroup: CfnReplicationSubnetGroup;
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const privateSubnets = cdk.Fn.importValue("privateSubnets");
    const subnetArray = cdk.Fn.split(",", privateSubnets);
    this.replicationSubnetGroup = new CfnReplicationSubnetGroup(
      this,
      "ReplicationSubnets",
      {
        subnetIds: subnetArray,
        replicationSubnetGroupDescription: "Subnets used by DMS instance",
        replicationSubnetGroupIdentifier: "DMSSubnets",
      },
    );
    new cdk.CfnOutput(this, "replicationSubnetGroup", {
      value: this.replicationSubnetGroup.ref,
    });
  }
}

