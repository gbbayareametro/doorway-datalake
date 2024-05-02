import * as cdk from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import * as DoorwayDatalake from "../lib/doorway-datalake-lambda-stack";

test("Lambda Created", () => {
  const app = new cdk.App();

  // WHEN
  const stack = new DoorwayDatalake.DataLakeLambdaStack(app, "LambdaTestStack");
  // THEN
  const template = Template.fromStack(stack);
  template.hasResourceProperties("AWS::Lambda::Function", {});
});
