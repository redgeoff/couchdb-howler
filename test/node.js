import './chai'
import testUtils from './utils'
import testServerUtils from './server-utils'

describe('node', () => {
  before(async () => {
    await testServerUtils.createTestServers()
    await testUtils.createTestUser()
  })

  after(async () => {
    await testServerUtils.destroyTestServers()
    await testUtils.destroyTestUser()
  })

  require('./node-and-browser')
  require('./spec/server')
})
