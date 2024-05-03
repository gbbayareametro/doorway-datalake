import * as cdk from "aws-cdk-lib";
import { IVpc, Vpc } from "aws-cdk-lib/aws-ec2";
import * as lambda from "aws-cdk-lib/aws-lambda";

export class LambdaInstance {
  scope: cdk.Stack;
  id: string;
  props?: cdk.StackProps;
  constructor(scope: cdk.Stack, id: string, props?: cdk.StackProps) {
    this.scope = scope;
    this.id = id;
    this.props = props;
  }
  create(name: string, vpc: IVpc) {
    const my_lambda = new lambda.Function(this.scope, "insert-db", {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'insert-db.handler',
      code: lambda.Code.fromAsset('./lambda-handler'),
      vpc: vpc,
      timeout: cdk.Duration.seconds(30)

    })
    return my_lambda;
  }
}
