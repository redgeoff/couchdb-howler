import cookie from '../../../src/client/cookie'
import jsCookie from 'js-cookie'
import nodeCookie from '../../../src/client/node-cookie'

describe('cookie', () => {
  it('should get browser cookie', () => {
    cookie.getProvider(true).should.eql(jsCookie)
  })

  it('should get node cookie', () => {
    cookie.getProvider(false).should.eql(nodeCookie)
  })
})
