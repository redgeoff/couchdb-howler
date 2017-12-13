import yargs from 'yargs'
import Server from './server'
import log from './log'

class Command {
  constructor () {
    this._usage()
  }

  _usage () {
    this._argv = yargs
      .usage('Usage: $0 [options]')
      .example('$0 --port 3000')
      .alias('p', 'port')
      .nargs('p', 1)
      .describe('p', 'Port')
      .help('h')
      .alias('h', 'help')
      .epilog('Copyright 2017').argv
  }

  async _start () {
    try {
      var server = new Server(this._argv)
      await server.start()

      // Gracefully handle SIGINT signals
      process.on('SIGINT', async () => {
        log.info('Stopping as received SIGNINT')
        await server.stop()
      })
    } catch (err) {
      try {
        await server.stop()
      } catch (err) {
        log.error('failed to stop')
      }
      log.fatal(err)
    }
  }

  async run () {
    // await this._start()
  }
}

module.exports = Command
