import { Stack, StackProps } from "aws-cdk-lib";
import { SecurityGroup } from "aws-cdk-lib/aws-ec2";
import { DatabaseInstance, DatabaseSecret } from "aws-cdk-lib/aws-rds";
import { Construct } from "constructs";
import { EndpointType, PostgreSQLEndpoint } from "dms-patterns";

export class DataLakeDMSStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);
        const secret = DatabaseSecret.fromSecretAttributes(this,"secret",{
            secretCompleteArn:"arn:aws:secretsmanager:us-east-2:364076391763:secret:DoorwayTestDbStackSecretCC3-dUp1tGcD6zhb-D6p5UJ"
        });

        const endpoint = new PostgreSQLEndpoint(this, "SourceEndpoint", {
            endpointType: EndpointType.SOURCE,
            databaseName: 'test',
            endpointIdentifier: 'pgEndpoint',
            postgresEndpointSettings: {
                secretsManagerSecretId: secret.secretArn
            }
        });
    }

}