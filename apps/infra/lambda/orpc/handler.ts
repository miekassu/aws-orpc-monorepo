import { createMainRouter } from '@repo/service-core';
import { APIGatewayProxyEventV2 } from 'aws-lambda'
import { streamifyResponse, ResponseStream } from 'lambda-stream'
import { RPCHandler } from '@orpc/server/aws-lambda'

// Database definition (in Lambda)
const database = {
  posts: [{ id: '0', title: 'initialPost', description: 'description' }],
};

const mainRouter = createMainRouter(database);
const rpcHandler = new RPCHandler(mainRouter)

/**
 * oRPC only supports AWS Lambda response streaming.
 * 
 * @see https://aws.amazon.com/blogs/compute/introducing-aws-lambda-response-streaming/
 */
async function myHandler(
  event: APIGatewayProxyEventV2,
  responseStream: ResponseStream
): Promise<void> {

  const { matched } = await rpcHandler.handle(event, responseStream, {
    prefix: '/rpc',
    context: {} // Provide initial context if needed
  })

  if (matched) {
    return
  }

  awslambda.HttpResponseStream.from(responseStream, {
    statusCode: 404,
  })

  responseStream.write('Not found')
  responseStream.end()
}

export const handler = streamifyResponse(myHandler)