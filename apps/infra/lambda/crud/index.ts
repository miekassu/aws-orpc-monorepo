import util from 'util'
import stream from 'stream'

const { Readable } = stream
const pipeline = util.promisify(stream.pipeline)

/* global awslambda */
export const handler = awslambda.streamifyResponse(
  async (event, responseStream) => {
    const requestStream = Readable.from(Buffer.from(JSON.stringify(event)))
    await pipeline(requestStream, responseStream)
  }
)
