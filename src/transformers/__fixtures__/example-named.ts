/* eslint-disable import/no-unresolved */
import { Construct, App, Stack, StackProps } from "@aws-cdk/core";

export class SomeConstruct extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);
  }
}

const app = App();
export class MyStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    new SomeConstruct(this, "SomeConstruct");
  }
}

new MyStack(app, "MyStack");
