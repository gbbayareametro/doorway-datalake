import * as cdk from "aws-cdk-lib";
import { assert } from "console";
import { LambdaInstance } from "../../lib/resources/lambda";
import * as lambda from "aws-cdk-lib/aws-lambda";

test("Lambda Created", () => {
  const stack = new cdk.Stack();
  const id = "test-id";
  const mylambda = new LambdaInstance(stack, id).create("my-lambda");
  assert(mylambda.runtime == lambda.Runtime.NODEJS_18_X);
});
