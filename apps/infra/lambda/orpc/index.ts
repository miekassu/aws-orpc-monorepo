import { APIGatewayProxyEventV2 } from 'aws-lambda'
import { RPCHandler } from '@orpc/server/aws-lambda'
import { postsRouter } from './router'

const rpcHandler = new RPCHandler(postsRouter)

/**
 * oRPC only supports [AWS Lambda response streaming](https://aws.amazon.com/blogs/compute/introducing-aws-lambda-response-streaming/).
 * If you need support chunked responses, use a combination of Hono's `aws-lambda` adapter and oRPC.
 */
export const handler = awslambda.streamifyResponse<APIGatewayProxyEventV2>(async (event, responseStream, context) => {
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
})