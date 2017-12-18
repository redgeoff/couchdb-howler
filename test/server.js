#!/usr/bin/env node

import 'babel-polyfill'
import testUtils from './utils'
import testServerUtils from './server-utils'

// Start test server
const start = async () => {
  await testServerUtils.createTestServers()
  await testUtils.createTestUser()
}

start()

process.on('SIGINT', async () => {
  await testServerUtils.destroyTestServers()
  await testUtils.destroyTestUser()
})
