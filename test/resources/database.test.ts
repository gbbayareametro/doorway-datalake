import * as cdk from "aws-cdk-lib";
import { RDSDBInstance } from "../../lib/resources/database";
import { assert } from "console";
import * as rds from "aws-cdk-lib/aws-rds";

test("RDS Database Created", () => {
  const stack = new cdk.Stack();
  const id = "test-id";
  const db = new RDSDBInstance(stack, id).create("this-db");
  assert(db.engine == rds.DatabaseInstanceEngine.POSTGRES);
});
