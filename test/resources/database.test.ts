import * as cdk from "aws-cdk-lib";
import { RDSDBInstance } from "../../lib/resources/database";
import { assert } from "console";
import * as rds from "aws-cdk-lib/aws-rds";
import { VpcInstance } from "../../lib/resources/vpc";

test("RDS Database Created", () => {
  const stack = new cdk.Stack();
  const id = "test-id";
  const vpc = new VpcInstance(stack, id).create("vpc");
  const db = new RDSDBInstance(stack, id).create("this-db", vpc);
  assert(db.engine == rds.DatabaseInstanceEngine.POSTGRES);
});