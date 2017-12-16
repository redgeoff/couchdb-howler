import Sockets from '../../../src/server/sockets'
import testUtils from '../../utils'

describe('sockets', () => {
  let sockets = new Sockets()
  let socket1 = { id: 1 }
  let socket2 = { id: 2 }

  it('should add and remove', () => {
    sockets.add(socket1)
    sockets.get(socket1.id).should.eql({ socket: socket1, dbNames: {} })
    sockets.remove(socket1)
    testUtils.shouldEqual(sockets.get(socket1.id), undefined)
  })

  it('should subscribe', () => {
    sockets.add(socket1)
    sockets.subscribe(socket1, ['db1', 'db2', 'db3', 'db4'])

    sockets.get(socket1.id).should.eql({
      socket: socket1,
      dbNames: { db1: true, db2: true, db3: true, db4: true }
    })
    sockets.getByDBName('db1').should.eql({ [socket1.id]: socket1 })
  })

  it('subscribe should handle duplicate subscriptions', () => () => {
    sockets.add(socket1)
    sockets.subscribe(socket1, ['db1', 'db2', 'db3', 'db4'])
    sockets.subscribe(socket1, ['db1', 'db2'])

    sockets.get(socket1.id).should.eql({
      socket: socket1,
      dbNames: { db1: true, db2: true, db3: true, db4: true }
    })
    sockets.getByDBName('db1').should.eql({ [socket1.id]: socket1 })
  })

  it('different sockets should subscribe to the same dbs', () => () => {
    sockets.add(socket1)
    sockets.subscribe(socket1, ['db1', 'db2', 'db3'])

    sockets.add(socket2)
    sockets.subscribe(socket2, ['db1', 'db3', 'db4'])

    sockets.get(socket1.id).should.eql({
      socket: socket1,
      dbNames: { db1: true, db2: true, db3: true }
    })

    sockets.get(socket2.id).should.eql({
      socket: socket1,
      dbNames: { db1: true, db3: true, db4: true }
    })

    sockets.getByDBName('db1').should.eql({ [socket1.id]: socket1, [socket2.id]: socket2 })
    sockets.getByDBName('db3').should.eql({ [socket1.id]: socket1, [socket2.id]: socket2 })
    sockets.getByDBName('db2').should.eql({ [socket1.id]: socket1 })
    sockets.getByDBName('db4').should.eql({ [socket4.id]: socket4 })
  })

  // it('should unsubscribe', () => {})
})
