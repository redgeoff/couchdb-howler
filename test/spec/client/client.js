// TODO: how to prevent connection w/o auth? Need to close if not logIn in X seconds? Also appears
// that can pass query params when connecting: https://socket.io/docs/client-api/#with-query-option

import Client from '../../../src/client/client'
import testUtils from '../../utils'

describe('client', () => {
  let client = null

  before(async () => {
    await testUtils.createTestServer()
    await testUtils.createTestUser()
  })

  after(async () => {
    await testUtils.destroyTestServer()
    await testUtils.destroyTestUser()
  })

  beforeEach(() => {
    client = new Client(testUtils.getServerURL())
  })

  afterEach(() => {
    client.stop()
  })

  // it('should not subscribe if not authenticated', async () => {
  //   await testUtils.shouldThrow(async () => {
  //     await client.subscribe('my-db')
  //   }, 'NotAuthenticatedError')
  // })
  //
  // it('should subscribe', async () => {
  //   await client.logIn(testUtils.username, testUtils.password)
  //   await client.subscribe('my-db')
  // })
  //
  // it('should not unsubscribe if not authenticated', async () => {
  //   await testUtils.shouldThrow(async () => {
  //     await client.unsubscribe('my-db')
  //   }, 'NotAuthenticatedError')
  // })
  //
  // it('should unsubscribe', async () => {
  //   await client.logIn(testUtils.username, testUtils.password)
  //   await client.subscribe('my-db')
  //   await client.unsubscribe('my-db')
  // })

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
