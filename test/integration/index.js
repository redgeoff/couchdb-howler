import Client from '../../src'
import testUtils from '../utils'
import sporks from 'sporks'

describe('integration', function () {
  this.timeout(25000)

  let client = null

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
})
