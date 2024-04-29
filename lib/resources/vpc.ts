import * as ec2 from 'aws-cdk-lib/aws-ec2'
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
export class VpcInstance {
    scope: Construct
    id: string
    props?: cdk.StackProps
    vpc: ec2.Vpc

    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        this.scope = scope
        this.id = id
        this.props = props
    }
    create(name: string) {
        this.vpc = new ec2.Vpc(this.scope, name, {
            ipAddresses: ec2.IpAddresses.cidr('10.0.0.0/16'),
        })
        return this.vpc
    }


}