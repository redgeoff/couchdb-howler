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
