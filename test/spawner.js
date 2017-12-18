import sporks from 'sporks'
import childProcess from 'child_process'

const spawn = childProcess.spawn

// TODO: move to sporks
class Spawner {
  run (command, opts, printOutput) {
    let child = spawn(command, opts)

    const onData = data => {
      if (printOutput) {
        console.log(data + '')
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
