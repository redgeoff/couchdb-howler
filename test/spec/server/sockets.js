import Sockets from '../../../src/server/sockets'

describe('sockets', () => {
  let sockets = new Sockets()
  let socket = { id: 1 }

  it('should add', () => {
    sockets.add(socket)
    sockets.get(socket.id).should.eql({ socket, dbNames: [] })
  })
})
