import Client from '../../../src/client/client'
import testUtils from '../../utils'

describe('client', function () {
  this.timeout(15000)

  let client = null

  beforeEach(() => {
    client = new Client(testUtils.getServer1URL())
  })

  afterEach(() => {
    client.stop()
  })

  // // TODO: test authentication
  //
  // // TODO: test cookie auth
  //
  // // it('should not subscribe if not authenticated', async () => {
  // //   await testUtils.shouldThrow(async () => {
  // //     await client.subscribe('my-db')
  // //   }, 'NotAuthenticatedError')
  // // })
  // //
  // // it('should subscribe', async () => {
  // //   await client.logIn(testUtils.username, testUtils.password)
  // //   await client.subscribe('my-db')
  // // })
  // //
  // // it('should not unsubscribe if not authenticated', async () => {
  // //   await testUtils.shouldThrow(async () => {
  // //     await client.unsubscribe('my-db')
  // //   }, 'NotAuthenticatedError')
  // // })
  // //
  // // it('should unsubscribe', async () => {
  // //   await client.logIn(testUtils.username, testUtils.password)
  // //   await client.subscribe('my-db')
  // //   await client.unsubscribe('my-db')
  // // })

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

  // it('should stop without being connected', () => {
  //   // Intentionally left empty
  // })
})
