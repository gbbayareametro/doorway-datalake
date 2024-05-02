import * as cdk from "aws-cdk-lib";
import { assert } from "console";
import { LambdaInstance } from "../../lib/resources/lambda";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { VpcInstance } from "../../lib/resources/vpc";

test("Lambda Created", () => {
  const stack = new cdk.Stack();
  const id = "test-id";
  const vpc = new VpcInstance(stack, id).create("test-vpc");

  const mylambda = new LambdaInstance(stack, id).create("my-lambda", vpc);
  assert(mylambda.runtime == lambda.Runtime.NODEJS_18_X);
});