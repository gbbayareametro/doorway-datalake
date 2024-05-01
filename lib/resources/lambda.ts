import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda-nodejs";
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

    const my_lambda = new lambda.NodejsFunction(this.scope, name, {
      handler: "insert-db.handler",
      entry: "./lib/resources/lambda/insert-db.ts",
      bundling: {
        commandHooks: {
          beforeBundling(inputDir: string, outputDir: string): string[] {
            return [`cp ${inputDir}/.env ${outputDir}`];
          },
          afterBundling(inputDir: string, outputDir: string): string[] {
            return [];
          },
          beforeInstall() {
            return [];
          },
          // ...
        },
        // ...
      },
    });
    return my_lambda;
  }
}
