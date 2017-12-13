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

  it('should not subscribe if not authenticated', async () => {
    await testUtils.shouldThrow(async () => {
      await client.subscribe('my-db')
    }, 'NotAuthenticatedError')
  })

  it('should subscribe', async () => {
    await client.logIn(testUtils.username, testUtils.password)
    await client.subscribe('my-db')
  })

  it('should not unsubscribe if not authenticated', async () => {
    await testUtils.shouldThrow(async () => {
      await client.unsubscribe('my-db')
    }, 'NotAuthenticatedError')
  })

  it('should unsubscribe', async () => {
    await client.logIn(testUtils.username, testUtils.password)
    await client.subscribe('my-db')
    await client.unsubscribe('my-db')
  })

  it('should log in, subscribe, unsubscribe, log out and repeat', async () => {
    const test = async () => {
      await client.logIn(testUtils.username, testUtils.password)
      await client.subscribe('my-db')
      await client.unsubscribe('my-db')
      await client.logOut()
    }

    await test()
    await test()
  })
})
