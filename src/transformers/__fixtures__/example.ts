/* eslint-disable import/no-unresolved */
import * as cdk from "@aws-cdk/core";

export class SomeConstruct extends cdk.Construct {
  constructor(scope: cdk.Construct, id: string) {
    super(scope, id);
  }
}

const app = cdk.App();
export class MyStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    new SomeConstruct(this, "SomeConstruct");
  }
}

new MyStack(app, "MyStack");
