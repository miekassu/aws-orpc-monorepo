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
  public readonly postsTable: aws_dynamodb.TableV2
  public readonly orpcHandler: aws_lambda_nodejs.NodejsFunction
  public readonly streamingFunction: aws_lambda_nodejs.NodejsFunction

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    // DynamoDB Table for Posts
    this.postsTable = new aws_dynamodb.TableV2(this, 'PostsTable', {
      partitionKey: {
        name: 'id',
        type: aws_dynamodb.AttributeType.STRING,
      },
      removalPolicy: RemovalPolicy.DESTROY,
    })

    // GSI for efficient time-based queries
    this.postsTable.addGlobalSecondaryIndex({
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
    this.postsTable.grantReadWriteData(this.orpcHandler)
    this.postsTable.grantReadData(this.streamingFunction)

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
