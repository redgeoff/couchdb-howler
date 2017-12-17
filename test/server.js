#!/usr/bin/env node

import 'babel-polyfill'
import testUtils from './utils'
import testServerUtils from './server-utils'

// Start test server
const start = async () => {
  await testServerUtils.createTestServer()
  await testUtils.createTestUser()
}

start()

process.on('SIGINT', async () => {
  await testServerUtils.destroyTestServer()
  await testUtils.destroyTestUser()
})
