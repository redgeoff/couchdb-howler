// TODO: move to sporks

import sporks from 'sporks'
import childProcess from 'child_process'

const spawn = childProcess.spawn

class Spawner {
  run (command, opts, ignoreErrors) {
    let child = spawn(command, opts)

    const onData = logEntry => {
      // Uncomment for extra debugging
      //
      // console.log('logEntry=', logEntry, '\n')

      // An error entry? There shouldn't be any errors
      if (!ignoreErrors) {
        console.error(logEntry + '')
      }
    }

    child.stdout.on('data', onData)

    child.stderr.on('data', data => {
      console.error('should not get data on stderr ' + JSON.stringify(opts) + ', data=' + data)
    })

    child.on('error', err => {
      console.error(err.message + ' for ' + JSON.stringify(opts))
    })

    child.on('close', code => {
      if (code > 0) {
        console.error('non-zero exit code for ' + JSON.stringify(opts))
      }
    })

    return child
  }

  async kill (child) {
    let closed = sporks.once(child, 'close')
    child.kill('SIGINT')
    await closed
  }
}

module.exports = new Spawner()
