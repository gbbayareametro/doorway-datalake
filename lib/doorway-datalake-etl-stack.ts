import * as cdk from 'aws-cdk-lib'
import * as s3 from 'aws-cdk-lib/aws-s3'
import * as glue from '@aws-cdk/aws-glue-alpha'
import { Construct } from 'constructs';
export class DataLakeETLStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: cdk.StackProps) {
        super(scope, id, props);
        const bucket = s3.Bucket.fromBucketName(this, 'DMSBucket', cdk.Fn.importValue('DMSOutputBucket'))
        const database = new glue.Database(this, 'DoorwayDataLake');
        const listingsTable = new glue.S3Table(this, 'ListingsTable', {
            database,
            columns: [{
                name: 'id',
                type: glue.Schema.INTEGER

            },
                {
                    name: 'address',
                    type: glue.Schema.STRING
                },
              {
                    name: 'city',
                    type: glue.Schema.STRING
                },
              {
                    name: 'state',
                    type: glue.Schema.STRING
                },
              {
                    name: 'zip',
                    type: glue.Schema.STRING
                },],
            dataFormat: glue.DataFormat.CSV,
            bucket: bucket,
            s3Prefix: 'public/Listing'
        })


    }
}