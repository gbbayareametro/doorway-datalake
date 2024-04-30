import * as cdk from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import * as DoorwayDatalake from "../lib/doorway-datalake-stack";
import * as ec2 from "aws-cdk-lib/aws-ec2";

test("RDS Database Created", () => {
  const app = new cdk.App();
  // WHEN
  const stack = new DoorwayDatalake.DoorwayDatalakeStack(app, "DBTestStack-db");
  // THEN
  const template = Template.fromStack(stack);

  template.hasResourceProperties("AWS::RDS::DBInstance", {
    DBInstanceClass: "db.t3.micro",
  });
});
// test("Lambda Created", () => {
//   const app = new cdk.App();
//   // WHEN
//   const stack = new DoorwayDatalake.DoorwayDatalakeStack(
//     app,
//     "LambdaTestStack",
//   );
//   // THEN
//   const template = Template.fromStack(stack);
//   template.hasResourceProperties("AWS::Lambda::Function", {});
// });
