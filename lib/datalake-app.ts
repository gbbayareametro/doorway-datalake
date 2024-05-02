import { App } from "aws-cdk-lib";
import { DataLakeLambdaStack } from "./doorway-datalake-lambda-stack";

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};
const app = new App();
const lambdaStack = new DataLakeLambdaStack(app, "lambda-stack", { env: env });
app.synth();
