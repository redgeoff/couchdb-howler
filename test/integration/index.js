// TODO: actually use CL for server

import Client from '../../src/client/client'
import testUtils from '../utils'

describe('integration', () => {
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

  it('should foo', () => {})
})
