import Client from '../../../src/client/client'
import testUtils from '../../utils'
import sinon from 'sinon'
import sporks from 'sporks'
import Session from '../../../src/client/session'

describe('client', function () {
  this.timeout(25000)

  let client = null

  beforeEach(() => {
    client = new Client(testUtils.getServer1URL())
  })

  const logOutAndIgnoreError = async () => {
    try {
      await client.logOut()
    } catch (err) {
      // Ignore error. This can occur as we may already have logged out or in there was an
      // (intentional) error when logging in
    }
  }

  afterEach(async () => {
    await logOutAndIgnoreError()
    client.stop()
  })

  const genCookie = async () => {
    await client.logIn(testUtils.username, testUtils.password)
    let cookie = await client._session.get()
    await client.logOut()
    return cookie
  }

  it('should log in and log out', async () => {
    let response = await client.logIn(testUtils.username, testUtils.password)

    testUtils.shouldNotEqual(response.cookie, undefined)
    let cookie = await client._session.get()
    testUtils.shouldNotEqual(cookie, undefined)
    cookie.should.eql(response.cookie)
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

  it('log out should clear cookies even if log out fails', async () => {
    await client.logIn(testUtils.username, testUtils.password)
    await client.logOut()

    let cookie = await client._session.get()
    testUtils.shouldEqual(cookie, undefined)
  })

  it('should log in with stored cookie', async () => {
    let cookie = await genCookie()

    // Create new client with a session to simulate creating session with a stored cookie
    let session = new Session()
    session.set(cookie)
    client = new Client(testUtils.getServer1URL(), session)

    // Wait for connection and make sure there was no error
    sinon.spy(client, '_connect')
    await sporks.waitFor(() => (client._connected ? true : undefined))
    testUtils.shouldEqual(client._connect.exceptions[0], undefined)
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
    await testUtils.shouldThrow(async () => {
      await client.logIn(null, null, 'invalid-cookie')
    }, 'NotAuthenticatedError')
  })

  it('should fail to log in with cookie', async () => {
    let cookie = await genCookie()

    let response = await client.logIn(null, null, cookie)

    testUtils.shouldNotEqual(response.cookie, undefined)
    cookie = await client._session.get()
    testUtils.shouldNotEqual(cookie, undefined)
    cookie.should.eql(response.cookie)
  })

  it('should subscribe when not already logged in', async () => {
    await client.subscribe('my-db')
  })

  it('should buffer subscriptions until log in', async () => {
    sinon.spy(client, '_emitSubscribe')
    await client.subscribe('db1')
    await client.subscribe('db2')
    client._emitSubscribe.notCalled.should.eql(true)

    let ready = sporks.once(client, 'ready')
    await client.logIn(testUtils.username, testUtils.password)
    await ready
    client._emitSubscribe.calledOnce.should.eql(true)
    client._emitSubscribe.getCall(0).args[0].should.eql(['db1', 'db2'])
  })

  it('should resubscribe when reconnecting', async () => {
    sinon.spy(client, '_emitSubscribe')
    await client.logIn(testUtils.username, testUtils.password)
    await client.subscribe('db1')
    await client.subscribe('db2')
    client._emitSubscribe.calledTwice.should.eql(true)
    client._emitSubscribe.getCall(0).args[0].should.eql(['db1'])
    client._emitSubscribe.getCall(1).args[0].should.eql(['db2'])
    await client.logOut()

    let ready = sporks.once(client, 'ready')
    await client.logIn(testUtils.username, testUtils.password)
    await ready
    client._emitSubscribe.calledThrice.should.eql(true)
    client._emitSubscribe.getCall(2).args[0].should.eql(['db1', 'db2'])
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

  it('should modify _subscribedToDBs when subscribing and unsubscribing', async () => {
    await client.subscribe('db1')
    await client.subscribe('db2')
    await client.subscribe('db3')
    await client.subscribe('db4')
    client._subscribedToDBs.should.eql({
      db1: true,
      db2: true,
      db3: true,
      db4: true
    })

    await client.unsubscribe('db2')
    await client.unsubscribe('db3')
    client._subscribedToDBs.should.eql({
      db1: true,
      db4: true
    })
  })
})
