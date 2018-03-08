import './set-up'
import testUtils from './utils'
import testServerUtils from './server-utils'

// Force a crash if there is a promise error. TODO: remove when future versions of node
// automatically do this.
process.on('unhandledRejection', err => {
  throw err
})

describe('node', () => {
  before(async () => {
    testServerUtils.silenceLog()
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
