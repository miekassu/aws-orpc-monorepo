/**
 * AWS Lambda handler that streams random numbers to the response stream for 10 seconds.
 * Each number is sent as a line of JSON.
 */
export const handler = awslambda.streamifyResponse(
  async (event, responseStream) => {
    console.log('Received event:', JSON.stringify(event, null, 2))

    const startTime = Date.now();
    const durationMs = 10_000;
    const intervalMs = 200;

    /**
     * Writes a random number to the response stream as a JSON line.
     */
    const writeRandomNumber = () => {
      const randomNumber = Math.random();
      responseStream.write(JSON.stringify({ randomNumber }) + '\n');
    };

    while (Date.now() - startTime < durationMs) {
      writeRandomNumber();
      await new Promise((resolve) => setTimeout(resolve, intervalMs));
    }

    responseStream.end();
  }
)
