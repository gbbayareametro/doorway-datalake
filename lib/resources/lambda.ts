import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as signer from "aws-cdk-lib/aws-signer";
import * as path from "path";
export class LambdaInstance {
  scope: cdk.Stack;
  id: string;
  props?: cdk.StackProps;
  constructor(scope: cdk.Stack, id: string, props?: cdk.StackProps) {
    this.scope = scope;
    this.id = id;
    this.props = props;
  }
  create(name: string) {
    const signingProfile = new signer.SigningProfile(
      this.scope,
      "SigningProfile",
      {
        platform: signer.Platform.AWS_LAMBDA_SHA384_ECDSA,
      },
    );

    const codeSigningConfig = new lambda.CodeSigningConfig(
      this.scope,
      "CodeSigningConfig",
      {
        signingProfiles: [signingProfile],
      },
    );

    const my_lambda = new lambda.Function(this.scope, name, {
      codeSigningConfig,
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: "insert-db.handler",
      code: lambda.Code.fromAsset(path.join(__dirname, "lambda")),
    });
    return my_lambda;
  }
}
