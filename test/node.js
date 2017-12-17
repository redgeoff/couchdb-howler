import './chai'
import testUtils from './utils'
import testServerUtils from './server-utils'

describe('node', () => {
  before(async () => {
    await testServerUtils.createTestServer()
    await testUtils.createTestUser()
  })

  after(async () => {
    await testServerUtils.destroyTestServer()
    await testUtils.destroyTestUser()
  })

  require('./node-and-browser')
  require('./spec/server')
})
