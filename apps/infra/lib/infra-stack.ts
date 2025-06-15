import {
  aws_apigatewayv2,
  aws_apigatewayv2_integrations,
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
  public readonly crudFunction: aws_lambda_nodejs.NodejsFunction
  public readonly streamingFunction: aws_lambda_nodejs.NodejsFunction
  public readonly api: aws_apigatewayv2.HttpApi

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
    this.crudFunction = new aws_lambda_nodejs.NodejsFunction(
      this,
      'CrudFunction',
      {
        entry: require.resolve('../lambda/crud/index.ts'),
        runtime: aws_lambda.Runtime.NODEJS_20_X,
        timeout: Duration.seconds(30),
        memorySize: 512,
      }
    )

    // Streaming Lambda Function
    this.streamingFunction = new aws_lambda_nodejs.NodejsFunction(
      this,
      'StreamingFunction',
      {
        entry: require.resolve('../lambda/streaming/index.ts'),
        runtime: aws_lambda.Runtime.NODEJS_20_X,
        timeout: Duration.minutes(15),
        memorySize: 1024,
      }
    )

    // Grant DynamoDB permissions
    this.entriesTable.grantReadWriteData(this.crudFunction)
    this.entriesTable.grantReadData(this.streamingFunction)

    // Lambda streamer only works via function URL
    const streamingUrl = this.streamingFunction.addFunctionUrl({
      authType: aws_lambda.FunctionUrlAuthType.NONE,
      invokeMode: aws_lambda.InvokeMode.RESPONSE_STREAM,
    })

    // API Gateway HTTP API
    this.api = new aws_apigatewayv2.HttpApi(this, 'ORPCApi', {
      corsPreflight: {
        allowOrigins: ['http://localhost:5137', 'http://localhost:5138'],
        allowMethods: [
          aws_apigatewayv2.CorsHttpMethod.POST,
          aws_apigatewayv2.CorsHttpMethod.OPTIONS,
        ],
      },
    })

    // Lambda Integrations
    const crudIntegration =
      new aws_apigatewayv2_integrations.HttpLambdaIntegration(
        'CrudIntegration',
        this.crudFunction
      )

    // API Routes
    this.api.addRoutes({
      path: '/api/rpc/{proxy+}',
      methods: [aws_apigatewayv2.HttpMethod.POST],
      integration: crudIntegration,
    })

    new CfnOutput(this, 'ApiEndpoint', {
      value: this.api.apiEndpoint,
      description: 'oRPC API Gateway endpoint',
    })

    new CfnOutput(this, 'StreamingEndpoint', {
      value: streamingUrl.url,
      description: 'Streaming Lambda function URL',
    })
  }
}
