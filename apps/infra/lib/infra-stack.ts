import {
  aws_dynamodb,
  aws_lambda,
  aws_lambda_nodejs,
  CfnOutput,
  Duration,
  RemovalPolicy,
  Stack,
  StackProps,
} from 'aws-cdk-lib'
import { Construct } from 'constructs'

export class InfraStack extends Stack {
  public readonly entriesTable: aws_dynamodb.TableV2
  public readonly orpcHandler: aws_lambda_nodejs.NodejsFunction
  public readonly streamingFunction: aws_lambda_nodejs.NodejsFunction

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    // DynamoDB Table for Entries
    this.entriesTable = new aws_dynamodb.TableV2(this, 'EntriesTable', {
      partitionKey: {
        name: 'id',
        type: aws_dynamodb.AttributeType.STRING,
      },
      removalPolicy: RemovalPolicy.DESTROY,
    })

    // GSI for efficient time-based queries
    this.entriesTable.addGlobalSecondaryIndex({
      indexName: 'CreatedAtIndex',
      partitionKey: {
        name: 'createdAt',
        type: aws_dynamodb.AttributeType.STRING,
      },
    })

    // CRUD Lambda Function
    this.orpcHandler = new aws_lambda_nodejs.NodejsFunction(
      this,
      'oRPCFunction',
      {
        entry: require.resolve('../lambda/orpc/index.ts'),
        runtime: aws_lambda.Runtime.NODEJS_20_X,
        timeout: Duration.seconds(30),
        memorySize: 512,
      }
    )

    // Grant DynamoDB permissions
    this.entriesTable.grantReadWriteData(this.orpcHandler)
    this.entriesTable.grantReadData(this.streamingFunction)

    // oRPC only works via function URL
    const oRPCEndpoint = this.streamingFunction.addFunctionUrl({
      authType: aws_lambda.FunctionUrlAuthType.NONE,
      invokeMode: aws_lambda.InvokeMode.RESPONSE_STREAM,
    })

    new CfnOutput(this, 'ApiEndpoint', {
      value: oRPCEndpoint.url,
      description: 'oRPC API Gateway endpoint',
    })
  }
}
