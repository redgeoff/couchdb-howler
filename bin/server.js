#!/usr/bin/env node

require('babel-polyfill')
const Command = require('../lib/server/command')

let cmd = new Command(process.argv)
cmd.run()
