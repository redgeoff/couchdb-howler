import yargs from 'yargs'
import Server from './server'
import log from './log'

class Command {
  _usage (argv) {
    this._argv = yargs(argv)
      .usage('Usage: $0 [options]')

      .example('$0 --couchdb-url https://admin:admin@localhost:5984 --port 3000')

      .alias('u', 'couchdb-url')
      .nargs('couchdb-url', 1)
      .describe('couchdb-url', 'URL to the CouchDB cluster')

      .alias('p', 'port')
      .nargs('p', 1)
      .describe('p', 'Port')
      .default('p', 3000)

      .help('h')
      .alias('h', 'help')

      .version('v')
      .alias('v', 'version')

      .demandOption(['couchdb-url'])

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

  async run (argv) {
    this._usage(argv)
    await this._start()
  }
}

module.exports = Command
