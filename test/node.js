import './chai'
import testUtils from './utils'
import serverTestUtils from './server-utils'

describe('node', () => {
  before(async () => {
    await serverTestUtils.createTestServer()
    await testUtils.createTestUser()
  })

  after(async () => {
    await serverTestUtils.destroyTestServer()
    await testUtils.destroyTestUser()
  })

  require('./node-and-browser')
})
