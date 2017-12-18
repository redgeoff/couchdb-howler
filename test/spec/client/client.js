import Client from '../../../src/client/client'
import testUtils from '../../utils'
import sinon from 'sinon'
import sporks from 'sporks'
import Session from '../../../src/client/session'

describe('client', function () {
  this.timeout(15000)

  let client = null

  beforeEach(() => {
    client = new Client(testUtils.getServer1URL())
  })

  afterEach(() => {
    client.stop()
  })

  it('should log in and log out', async () => {
    let response = await client.logIn(testUtils.username, testUtils.password)

    testUtils.shouldNotEqual(response.cookie, undefined)
    let cookie = await client._session.get()
    testUtils.shouldNotEqual(cookie, undefined)
    cookie.should.eql(response.cookie)

    await client.logOut()
  })

  it('should throw when log in fails', async () => {
    await testUtils.shouldThrow(async () => {
      await client.logIn(testUtils.username, testUtils.password + 'nope')
    }, 'NotAuthenticatedError')
  })

  it('should log out when not logged in', async () => {
    await testUtils.shouldThrow(
      async () => {
        await client.logOut()
      },
      'Error',
      'not connected'
    )
  })

  it('should log in with stored cookie', async () => {
    await client.logIn(testUtils.username, testUtils.password)
    let cookie = await client._session.get()
    await client.logOut()

    // Create new client with a session to simulate creating session with a stored cookie
    let session = new Session()
    session.set(cookie)
    client = new Client(testUtils.getServer1URL(), session)

    // Wait for connection and make sure there was no error
    sinon.spy(client, '_connect')
    await sporks.waitFor(() => (client._connected ? true : undefined))
    testUtils.shouldEqual(client._connect.exceptions[0], undefined)

    await client.logOut()
  })

  it('should fail to log in with stored cookie', async () => {
    // Simulate having a bad or expired cookie
    let session = new Session()
    session.set('invalid-cookie')
    client = new Client(testUtils.getServer1URL(), session)

    // Wait for connection and make sure there was an error
    let err = await sporks.once(client, 'error')
    err[0].name.should.eql('NotAuthenticatedError')
  })

  it('should log in with cookie', async () => {
    // TODO
  })

  it('should fail to log in with cookie', async () => {
    // TODO
  })

  // TODO: test what happens when try to subscribe and haven't logged in

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

  // TODO: make sure to test that in browser stored cookie is retrieved
})
