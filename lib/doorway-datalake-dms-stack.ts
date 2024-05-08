import * as cdk from 'aws-cdk-lib';
import * as dms from 'aws-cdk-lib/aws-dms';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';

import { DatabaseSecret } from 'aws-cdk-lib/aws-rds';
import { Construct } from 'constructs';
interface DMSStackProps extends cdk.StackProps {
  replicationSubnetGroup: dms.CfnReplicationSubnetGroup;
}
export class DataLakeDMSStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: DMSStackProps) {
    super(scope, id, props);
    const secret = DatabaseSecret.fromSecretNameV2(this, 'DatabaseSecret', cdk.Fn.importValue('dbSecret'))


    const replicationInstance = new dms.CfnReplicationInstance(
      this,
      'ReplicationInstance',
      {
        replicationInstanceClass: 'dms.t2.micro',
        publiclyAccessible: false,
        vpcSecurityGroupIds: ['sg-0d34e6edb6d097c24'],
        replicationSubnetGroupIdentifier:
          props.replicationSubnetGroup.replicationSubnetGroupIdentifier
      }
    );
    const serviceRole = new iam.Role(this, 'DMSServiceWriteRole', {
      assumedBy: new iam.ServicePrincipal('dms.us-east-2.amazonaws.com')
    });
    const outputBucket = new s3.Bucket(this, 'outputBucket', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      versioned: false,
      removalPolicy: cdk.RemovalPolicy.RETAIN
    });
    outputBucket.grantReadWrite(serviceRole)

    serviceRole.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        resources: [outputBucket.bucketArn],
        actions: ['s3:PutObject', 's3:GetObject', 's3:ListBucket']
      })
    );
    serviceRole.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        resources: [secret.secretArn],
        actions: ['iam:PassRole', 'secretsmanager:getSecretValue']
      })
    );
    secret.grantRead(serviceRole)

    const postgresEndpoint = new dms.CfnEndpoint(this, 'postgresEndpoint', {
      sslMode: 'require',
      endpointType: 'source',
      engineName: 'postgres',
      databaseName: 'test',
      postgreSqlSettings: {
        secretsManagerSecretId: secret.secretName,
        secretsManagerAccessRoleArn: serviceRole.roleArn
      }
    });
    const s3Endpoint = new dms.CfnEndpoint(this, 'outputBucketEndpoint', {
      endpointType: 'target',
      engineName: 's3',
      s3Settings: {
        bucketName: outputBucket.bucketName,
        serviceAccessRoleArn: serviceRole.roleArn
      }
    });
    const tableMappings = {
      rules: [
        {
          'rule-type': 'selection',
          'rule-id': '1',
          'rule-name': 'listingsTable',
          'object-locator': {
            'schema-name': 'public',
            'table-name': 'listings'
          },
          'rule-action': 'include'
        },
        {
          'rule-type': 'selection',
          'rule-id': '2',
          'rule-name': 'applicationsTable',
          'object-locator': {
            'schema-name': 'public',
            'table-name': 'applications'
          },
          'rule-action': 'include'
        }
      ]
    };
    const replicationTask = new dms.CfnReplicationTask(this, 'DoorwayDBCDC', {
      migrationType: 'full-load-and-cdc',
      replicationInstanceArn: replicationInstance.ref,
      sourceEndpointArn: postgresEndpoint.ref,
      targetEndpointArn: s3Endpoint.ref,
      tableMappings: JSON.stringify(tableMappings),

    });


  }
}
