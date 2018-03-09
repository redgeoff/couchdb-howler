import Client from '../../../src/client/client'
import testUtils from '../../utils'
import testServerUtils from '../../server-utils'
import sporks from 'sporks'
import sinon from 'sinon'

describe('server', function () {
  this.timeout(5000)

  let client = null

  const createTestDB = async () => {
    await testUtils.slouch.db.create('test_db')
  }

  const destroyTestDB = async () => {
    await testUtils.slouch.db.destroy('test_db')
  }

  beforeEach(async () => {
    client = new Client(testUtils.getServer1URL())
    await createTestDB()
  })

  afterEach(async () => {
    await client.stop()
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

  it('should stop when not already started', async () => {
    await testServerUtils.createTestServer3()
    await testServerUtils.destroyTestServer3()
  })

  it('should handle errors when subscribing', async () => {
    let err = new Error('some-error')
    sinon.stub(testServerUtils._server1._sockets, 'subscribe').throws(err)
    await client.logIn(testUtils.username, testUtils.password)
    await testUtils.shouldThrow(
      async () => {
        await client.subscribe('test_db')
      },
      null,
      err.message
    )
    testServerUtils._server1._sockets.subscribe.calledOnce.should.eql(true)
  })
})
