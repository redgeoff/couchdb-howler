import commonUtils from '../../../src/utils'
import Session from '../../../src/client/session'

describe('session', () => {
  if (commonUtils.inBrowser()) {
    let session = null

    beforeEach(async () => {
      session = new Session()
    })

    afterEach(async () => {
      await session.clear()
    })

    it('should recall cookie', async () => {
      session.set('monster')

      let session2 = new Session()
      let cookie = await session2.get()
      cookie.should.eql('monster')
    })
  }
})
