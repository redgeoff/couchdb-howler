import Command from '../../../src/server/command'
import testUtils from '../../utils'
import config from '../../config.js'
import sinon from 'sinon'

describe('command', () => {
  let command = null

  beforeEach(() => {
    command = new Command([
      '--port',
      config.server3.port,
      '--couchdb-url',
      testUtils.getCouchDBURL()
    ])
  })

  const run = async () => {
    await command.run()
  }

  it('should run', async () => {
    await run()
    await command._server.stop()
  })

  it('should handle fatal error when starting', async () => {
    sinon.stub(command._server, 'start').throws()
    sinon.spy(command, '_onFatalError')
    await command._start()
    command._onFatalError.calledOnce.should.eql(true)
  })

  it('should handle sigint', async () => {
    sinon.spy(command, '_stop')
    await run()

    // Simulate SIGINT
    await command._onSigIntFactory()()

    command._stop.calledOnce.should.eql(true)
  })

  it('should catch error when stopping', async () => {
    sinon.stub(command, '_stop').throws()
    await command._onFatalError()
    command._stop.calledOnce.should.eql(true)
  })
})
