import Sockets from '../../../src/server/sockets'
import testUtils from '../../utils'
import sinon from 'sinon'
import MockSocket from './mock-socket'

describe('sockets', () => {
  let sockets = null
  let socket1 = new MockSocket(1)
  let socket2 = new MockSocket(2)

  beforeEach(() => {
    sockets = new Sockets()
  })

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

  it('should remove subscriptions', () => {
    sockets.add(socket1)
    sockets.subscribe(socket1, ['db1', 'db2'])
    sockets.remove(socket1)
    testUtils.shouldEqual(sockets.getByDBName('db1'), undefined)
    testUtils.shouldEqual(sockets.getByDBName('db2'), undefined)
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
      socket: socket2,
      dbNames: { db1: true, db3: true, db4: true }
    })

    sockets.getByDBName('db1').should.eql({ [socket1.id]: socket1, [socket2.id]: socket2 })
    sockets.getByDBName('db2').should.eql({ [socket1.id]: socket1 })
    sockets.getByDBName('db3').should.eql({ [socket1.id]: socket1, [socket2.id]: socket2 })
    sockets.getByDBName('db4').should.eql({ [socket2.id]: socket2 })
  })

  it('should unsubscribe', () => {
    sockets.add(socket1)
    sockets.subscribe(socket1, ['db1', 'db2', 'db3', 'db4'])
    sockets.unsubscribe(socket1, ['db1', 'db3'])

    sockets.get(socket1.id).should.eql({
      socket: socket1,
      dbNames: { db2: true, db4: true }
    })

    testUtils.shouldEqual(sockets.getByDBName('db1'), undefined)
    sockets.getByDBName('db2').should.eql({ [socket1.id]: socket1 })
    testUtils.shouldEqual(sockets.getByDBName('db3'), undefined)
    sockets.getByDBName('db4').should.eql({ [socket1.id]: socket1 })
  })

  it('should unsubscribe from all', () => {
    sockets.add(socket1)
    sockets.subscribe(socket1, ['db1', 'db2'])
    sockets.unsubscribe(socket1, ['db1', 'db2'])

    sockets.get(socket1.id).should.eql({
      socket: socket1,
      dbNames: {}
    })

    testUtils.shouldEqual(sockets.getByDBName('db1'), undefined)
    testUtils.shouldEqual(sockets.getByDBName('db2'), undefined)
  })

  it('should unsubscribe when not subscribed', () => {
    sockets.add(socket1)
    sockets.unsubscribe(socket1, ['db1'])

    sockets.get(socket1.id).should.eql({
      socket: socket1,
      dbNames: {}
    })

    testUtils.shouldEqual(sockets.getByDBName('db1'), undefined)
  })

  it('should unsubscribe when db subscribed to by multiple dbs', () => {
    sockets.add(socket1)
    sockets.subscribe(socket1, ['db1', 'db2', 'db3'])

    sockets.add(socket2)
    sockets.subscribe(socket2, ['db1', 'db3', 'db4'])

    sockets.unsubscribe(socket1, ['db1', 'db2'])

    sockets.get(socket1.id).should.eql({
      socket: socket1,
      dbNames: { db3: true }
    })

    sockets.get(socket2.id).should.eql({
      socket: socket2,
      dbNames: { db1: true, db3: true, db4: true }
    })

    sockets.getByDBName('db1').should.eql({ [socket2.id]: socket2 })
    testUtils.shouldEqual(sockets.getByDBName('db2'), undefined)
    sockets.getByDBName('db3').should.eql({ [socket1.id]: socket1, [socket2.id]: socket2 })
    sockets.getByDBName('db4').should.eql({ [socket2.id]: socket2 })
  })

  it('should close', () => {
    sinon.spy(sockets, 'remove')
    sinon.spy(sockets, 'close')

    sockets.add(socket1)
    sockets.add(socket2)

    sockets.close()

    sockets.remove.calledTwice.should.eql(true)
    socket1.disconnect.calledOnce.should.eql(true)
    socket2.disconnect.calledOnce.should.eql(true)
  })

  it('should emit change for db name', () => {
    sockets.add(socket1)
    sockets.subscribe(socket1, ['db1', 'db2'])
    sockets.add(socket2)
    sockets.subscribe(socket2, ['db1', 'db3'])

    // Sanity test for when there are no subscribers
    sockets.emitChangeForDBName('db4')
    socket1.emit.notCalled.should.eql(true)
    socket2.emit.notCalled.should.eql(true)

    // For 2 subscribers
    sockets.emitChangeForDBName('db1')
    socket1.emit.calledOnce.should.eql(true)
    socket1.emit.getCall(0).args.should.eql(['change', 'db1'])
    socket2.emit.calledOnce.should.eql(true)
    socket2.emit.getCall(0).args.should.eql(['change', 'db1'])
  })
})
