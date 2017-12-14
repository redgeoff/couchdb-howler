// TODO: actually use CL for server

import Client from '../../src/client/client'
import testUtils from '../utils'
import sporks from 'sporks'

describe('integration', function () {
  this.timeout(10000)

  let client = null
  let delay = 3000

  before(async () => {
    await testUtils.createTestServer()
    await testUtils.createTestUser()
  })

  after(async () => {
    await testUtils.destroyTestServer()
    await testUtils.destroyTestUser()
  })

  const createTestDB = async () => {
    await testUtils.slouch.db.create('test_db')
  }

  const destroyTestDB = async () => {
    await testUtils.slouch.db.destroy('test_db')
  }

  beforeEach(async () => {
    client = new Client(testUtils.getServerURL())
    await createTestDB()
  })

  afterEach(async () => {
    client.stop()
    await destroyTestDB()
  })

  const createOrUpdateDoc = async () => {
    await testUtils.slouch.doc.createOrUpdate('test_db', {
      _id: '1',
      updated_at: new Date().toISOString()
    })
  }

  it('should receive changes', async () => {
    await client.logIn(testUtils.username, testUtils.password)

    await client.subscribe('test_db')

    await createOrUpdateDoc('test_db')

    // TODO: use waitFor instead!
    await sporks.timeout(delay)

    // TODO: make sure got changes for test_db

    await client.logOut()
  })
})
