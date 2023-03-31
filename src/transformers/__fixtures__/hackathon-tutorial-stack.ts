/* eslint-disable import/no-unresolved */
import { Stack, Construct, StackProps, RemovalPolicy } from '@aws-cdk/core';
import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs';
import { join } from 'path';
import { Runtime } from '@aws-cdk/aws-lambda';
import { AttributeType, Table } from '@aws-cdk/aws-dynamodb';
import config from 'config';
import { HackathonTableConstruct } from './table-construct';

export interface HackathonStackProps extends StackProps{
  original?: HackathonTutorialStack;
}

export class HackathonTutorialStack extends Stack {
  table: Table;

  constructor(scope: Construct, id: string, props?: HackathonStackProps) {
    super(scope, id, props);

    const { namespace } = config.get<{ namespace: string }>('cdk');

    const table = new HackathonTableConstruct(this, `someTable`);
    this.table = table.table;

  }
}
