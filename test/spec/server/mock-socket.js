import sinon from 'sinon'

class MockSocket {
  constructor (id) {
    this.id = id
    sinon.spy(this, 'disconnect')
  }
  disconnect () {}
}

module.exports = MockSocket
