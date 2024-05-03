import { RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import * as dms from "aws-cdk-lib/aws-dms";
import { DatabaseInstance, DatabaseSecret } from "aws-cdk-lib/aws-rds";
import {
  BlockPublicAccess,
  Bucket,
  BucketEncryption,
} from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";
import {
  CapacityUnits,
  EndpointType,
  PostgreSQLEndpoint,
  ReplicationTypes,
  S3TargetEndpoint,
  SelectionAction,
  SelectionRule,
  TableMappings,
} from "dms-patterns";

export class DataLakeDMSStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    const secret = DatabaseSecret.fromSecretAttributes(this, "secret", {
      secretCompleteArn:
        "arn:aws:secretsmanager:us-east-2:364076391763:secret:DoorwayTestDbStackSecretCC3-dUp1tGcD6zhb-D6p5UJ",
    });

    const sourceEndpoint = new PostgreSQLEndpoint(this, "SourceEndpoint", {
      endpointType: EndpointType.SOURCE,
      databaseName: "test",
      endpointIdentifier: "pgEndpoint",
      postgresEndpointSettings: {
        secretsManagerSecretId: secret.secretArn,
      },
    });
    const replicationSubnetGroup = new dms.CfnReplicationSubnetGroup(
      this,
      "ReplicationSubnetGroup",
      {
        replicationSubnetGroupDescription: "ReplicationSubnetGroup",
        replicationSubnetGroupIdentifier: "mysqlreplicationsubnetID",
        subnetIds: ["subnet-0e0c6bb5a6a2de244", "subnet-0da86c74b26023379"],
      }
    );

    const computeConfig: dms.CfnReplicationConfig.ComputeConfigProperty = {
      minCapacityUnits: CapacityUnits._1,
      maxCapacityUnits: CapacityUnits._1,
      multiAz: false,
      replicationSubnetGroupId:
        replicationSubnetGroup.replicationSubnetGroupIdentifier,
      vpcSecurityGroupIds: ["sg-01b5ca28c998c0450"],
    };
    const tableMappings = new TableMappings([
      new SelectionRule({
        objectLocator: {
          schemaName: "public",
          tableName: "Listings",
        },
        ruleAction: SelectionAction.INCLUDE,
      }),
      new SelectionRule({
        objectLocator: {
          schemaName: "public",
          tableName: "Applications",
        },
        ruleAction: SelectionAction.INCLUDE,
      }),
    ]);

    const replicationBucket = new Bucket(this, "replicationBucket", {
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      encryption: BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      versioned: false,
      removalPolicy: RemovalPolicy.DESTROY,
    });
    const targetEndpoint = new S3TargetEndpoint(this,"testTargetEndpoint", {
        bucketArn: replicationBucket.bucketArn

    });
    const replicationConfig = new dms.CfnReplicationConfig(
      this,
      "TestReplication",
      {
        computeConfig: computeConfig,
        replicationConfigIdentifier: 'TestReplication',
        replicationType: ReplicationTypes.FULL_LOAD_AND_CDC,
        sourceEndpointArn: sourceEndpoint.ref,
        tableMappings: tableMappings.format(),
        targetEndpointArn: targetEndpoint.ref     }
    );
  }
}
