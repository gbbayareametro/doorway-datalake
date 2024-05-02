import * as cdk from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2"
import { assert } from "console";
import { LambdaInstance } from "../../lib/resources/lambda";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { VpcInstance } from "../../../doorway-test-db/lib/resources/vpc";

test("Lambda Created", () => {
  const stack = new cdk.Stack();
  const id = "test-id";
  const vpc =  new ec2.Vpc(stack,"this")
  const mylambda = new LambdaInstance(stack, id).create("my-lambda", vpc);
  assert(mylambda.runtime == lambda.Runtime.NODEJS_18_X);
});
