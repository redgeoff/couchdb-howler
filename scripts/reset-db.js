#!/usr/bin/env node

const Slouch = require('couch-slouch')
const config = require('../test/config.json')

let slouch = new Slouch(
  config.couchdb.scheme +
    '://' +
    config.couchdb.username +
    ':' +
    config.couchdb.password +
    '@' +
    config.couchdb.host +
    ':' +
    config.couchdb.port
)

slouch.system.reset()
