#!/usr/bin/env node

import 'babel-polyfill'
import testUtils from './utils'
import serverTestUtils from './server-utils'

// Start test server
const start = async () => {
  await serverTestUtils.createTestServer()
  await testUtils.createTestUser()
}

start()

process.on('SIGINT', async () => {
  await serverTestUtils.destroyTestServer()
  await testUtils.destroyTestUser()
})
