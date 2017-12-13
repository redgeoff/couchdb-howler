import Server from '../../../src/server/server'
import Client from '../../../src/client/client'

describe('client', () => {
  let server = null
  let client = null
  let port = 3000
  let url = 'http://localhost:' + port

  before(async () => {
    server = new Server({ port: port })
    await server.start()
  })

  after(async () => {
    await server.stop()
  })

  beforeEach(() => {
    client = new Client(url)
  })

  afterEach(() => {
    client.stop()
  })

  it('should foo', async () => {
    await client.subscribe('my-db')
  })
})
