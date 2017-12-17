import Command from '../../../src/server/command'
import testUtils from '../../utils'
import config from '../../config.js'

describe('command', () => {
  let command = null

  it('should run', async () => {
    command = new Command()
    await command.run(['--port', config.server3.port, '--couchdb-url', testUtils.getCouchDBURL()])
    await command._server.stop()
  })
})
