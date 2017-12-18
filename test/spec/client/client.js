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

  it('should log in and log out', async () => {
    await client.logIn(testUtils.username, testUtils.password)
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

  // TODO: test cookie auth (success and failure)

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
