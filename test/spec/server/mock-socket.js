import sinon from 'sinon'

class MockSocket {
  constructor (id) {
    this.id = id
    this.conn = {
      remoteAddress: '127.0.0.1'
    }

    sinon.spy(this, 'disconnect')
    sinon.spy(this, 'emit')
  }

  disconnect () {}
  emit () {}
}

module.exports = MockSocket
