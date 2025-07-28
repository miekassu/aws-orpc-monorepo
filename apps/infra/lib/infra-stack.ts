import {
  aws_lambda,
  aws_lambda_nodejs,
  CfnOutput,
  Duration,
  Stack,
  StackProps,
} from 'aws-cdk-lib'
import { Construct } from 'constructs'

export class InfraStack extends Stack {
  public readonly orpcHandler: aws_lambda_nodejs.NodejsFunction

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

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

    // oRPC only works via function URL
    const oRPCEndpoint = this.orpcHandler.addFunctionUrl({
      authType: aws_lambda.FunctionUrlAuthType.NONE,
      invokeMode: aws_lambda.InvokeMode.RESPONSE_STREAM,
      cors: {
        allowedOrigins: ['*'],
        allowedMethods: [
          aws_lambda.HttpMethod.ALL
        ],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
      }
    })

    new CfnOutput(this, 'ApiEndpoint', {
      value: oRPCEndpoint.url,
      description: 'oRPC API Gateway endpoint',
    })
  }
}
