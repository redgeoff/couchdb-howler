import Client from '../../index'
import testUtils from '../utils'
import sporks from 'sporks'
import spawner from '../spawner'
import config from '../config.js'
import path from 'path'

describe('integration', function () {
  this.timeout(10000)

  let client = null
  let server = null

  const createTestServer = () => {
    server = spawner.run(path.join(__dirname, '../../bin/server.js'), [
      '--port',
      config.server2.port,
      '--couchdb-url',
      testUtils.getCouchDBURL()
    ])
  }

  const destroyTestServer = async () => {
    await spawner.kill(server)
  }

  before(() => {
    createTestServer()
  })

  after(async () => {
    await destroyTestServer()
  })

  const createTestDB = async () => {
    await testUtils.slouch.db.create('test_db')
  }

  const destroyTestDB = async () => {
    await testUtils.slouch.db.destroy('test_db')
  }

  beforeEach(async () => {
    client = new Client(testUtils.getServer2URL())
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

    let changed = sporks.once(client, 'change')

    await createOrUpdateDoc('test_db')

    // Wait for change
    let change = await changed
    change[0].should.eql('test_db')

    await client.logOut()
  })
})
