import Server from '../../../src/server/server'
import Client from '../../../src/client/client'
import testUtils from '../../utils'

describe('client', () => {
  let server = null
  let client = null
  let port = 3000
  let clientURL = 'http://localhost:' + port

  before(async () => {
    server = new Server({ port: port, 'couchdb-url': testUtils.getCouchDBURL() })
    await server.start()
    await testUtils.createTestUser()
  })

  after(async () => {
    await server.stop()
    await testUtils.destroyTestUser()
  })

  beforeEach(() => {
    client = new Client(clientURL)
  })

  afterEach(() => {
    client.stop()
  })

  it('should subscribe', async () => {
    await client.logIn(testUtils.username, testUtils.password)
    await client.subscribe('my-db')
  })

  it('should not subscribe if not authenticated', async () => {
    await testUtils.shouldThrow(async () => {
      await client.subscribe('my-db')
    }, 'NotAuthenticatedError')
  })

  it('should not unsubscribe if not authenticated', async () => {
    await testUtils.shouldThrow(async () => {
      await client.unsubscribe('my-db')
    }, 'NotAuthenticatedError')
  })
})
