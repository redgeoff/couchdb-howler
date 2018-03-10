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

  const stopClient = async () => {
    await logOutAndIgnoreError()
    await client.stop()
  }

  afterEach(async () => {
    await stopClient()
  })

  const genCookie = async () => {
    // Create another client, client2, so that we don't change anything in our test client
    const client2 = new Client(testUtils.getServer1URL())
    await client2.logIn(testUtils.username, testUtils.password)
    let cookie = await client2._session.get()
    await client2.stop()
    return cookie
  }

  it('should stop before connecting', async () => {
    await stopClient()
  })

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
    sinon.stub(client, '_emitLogOut').throws()
    await client.logIn(testUtils.username, testUtils.password)
    await testUtils.shouldThrow(async () => {
      await client.logOut()
    })

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

  it('should resubscribe when using existing cookie', async () => {
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

  it('should resubscribe when reconnecting', async () => {
    sinon.spy(client, '_emitSubscribe')
    await client.logIn(testUtils.username, testUtils.password)
    await client.subscribe('db1')
    await client.subscribe('db2')

    let ready = sporks.once(client, 'ready')

    // Simulate the server going down and then back up
    client._onAuthenticatedFactory()()

    await ready
    client._emitSubscribe.calledThrice.should.eql(true)
    client._emitSubscribe.getCall(2).args[0].should.eql(['db1', 'db2'])
  })

  it('should handle not-authenticated event when reconnecting', async () => {
    // This scenario can happen when the server goes down, a cookie expires and then the server
    // comes back online

    sinon.spy(client, '_emitError')
    await client.logIn(testUtils.username, testUtils.password)

    let error = sporks.once(client, 'error')

    // Simulate receiving a not-authenticated event
    client._onNotAuthenticatedFactory()({
      error: true,
      errorName: 'NotAuthenticatedError'
    })

    await error

    client._emitError.getCall(0).args[0].name.should.eql('NotAuthenticatedError')
  })

  it('should not emit error when stopping', async () => {
    // This can happen when there are race conditions with stopping and connecting/re-connecting
    sinon.spy(client, '_emitError')
    sinon.stub(client, '_connect').throws()
    client._stopped = true
    await client._connectAndEmitIfError()
    client._emitError.notCalled.should.eql(true)
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

  it('should send heartbeat', async () => {
    // Make the heartbeat more frequent for testing
    client._heartbeatMilliseconds = 100

    sinon.spy(client, '_beat')

    await client.logIn(testUtils.username, testUtils.password)

    await sporks.waitFor(() => {
      return client._beat.callCount >= 3 ? true : undefined
    })

    // Make sure we got a response from the server
    const value1 = await client._beat.getCall(0).returnValue
    const value2 = await client._beat.getCall(1).returnValue
    value1.ok.should.equal(true)
    value2.ok.should.equal(true)
  })

  it('should handle race on socket disconnect', async () => {
    sinon.stub(client, '_disconnectSocket')
    await client._disconnectSocketIfNotDisconnecting()
    client._disconnectSocket.calledOnce.should.eql(true)

    // We are already disconnecting so _disconnectSocket should not be called
    await client._disconnectSocketIfNotDisconnecting()
    client._disconnectSocket.calledOnce.should.eql(true)
  })

  it('should reconnect if too long since heartbeat', () => {
    sinon.stub(client, '_disconnectSocketIfConnected')
    sinon.stub(client, '_disconnect')

    // Mock a date in the past
    client._lastHeartbeatAt = new Date(new Date().getTime() - 10000)

    client._heartbeatMilliseconds = 1

    client._reconnectIfTooLongSinceHeartbeat()
    client._disconnectSocketIfConnected.calledOnce.should.eql(true)
    client._disconnect.calledOnce.should.eql(true)
  })
})
