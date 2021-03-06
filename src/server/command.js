import yargs from 'yargs'
import Server from './server'
import log from './log'

class Command {
  constructor (argv) {
    this._usage(argv)
    this._createServer()
  }

  _usage (argv) {
    this._argv = yargs(argv)
      .usage('Usage: $0 [options]')

      .example('$0 --couchdb_url https://admin:admin@localhost:5984 --port 3000')

      .alias('u', 'couchdb_url')
      .nargs('couchdb_url', 1)
      .describe('couchdb_url', 'URL to the CouchDB cluster')

      .alias('p', 'port')
      .nargs('p', 1)
      .describe('p', 'Port')
      .default('p', 3000)

      .alias('l', 'log_level')
      .nargs('l', 1)
      .describe(
        'l',
        [
          'error|warn|info|debug. Setting a particular level implies that all log records at that',
          'level and above are logged.'
        ].join(' ')
      )
      .default('l', 'info')

      .help('h')
      .alias('h', 'help')

      // Note: yargs version functionality disabled or else it causes problems
      // .version('v')
      .describe('v', 'Show version number')
      .alias('v', 'version')

      .demandOption(['couchdb_url'])

      .epilog('Copyright 2017').argv
  }

  async _stop () {
    await this._server.stop()
  }

  _onSigIntFactory () {
    return async () => {
      log.info('Stopping as received SIGINT')
      await this._stop()
    }
  }

  async _onFatalError (err) {
    try {
      await this._stop()
    } catch (err) {
      log.error('failed to stop')
    }
    log.fatal(err)
  }

  _createServer () {
    this._server = new Server(this._argv)

    // Gracefully handle SIGINT signals
    process.on('SIGINT', this._onSigIntFactory())
  }

  async _start () {
    try {
      await this._server.start()
    } catch (err) {
      await this._onFatalError(err)
    }
  }

  async run (argv) {
    await this._start()
  }
}

module.exports = Command
