import { APIGatewayProxyEventV2 } from 'aws-lambda'

export const handler = async (event: APIGatewayProxyEventV2) => {
  console.log('Received event:', JSON.stringify(event, null, 2))

  // Example response
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Hello from the CRUD Lambda function!',
      input: event,
    }),
  }
}
