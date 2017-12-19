# couchdb-howler

[![Circle CI](https://circleci.com/gh/redgeoff/couchdb-howler.svg?style=svg&circle-token=9149c22bf1b5236c7a56bc72a38b2f48947a8716)](https://circleci.com/gh/redgeoff/couchdb-howler) [![Greenkeeper badge](https://badges.greenkeeper.io/redgeoff/couchdb-howler.svg)](https://greenkeeper.io/)

Use web sockets to subscribe to CouchDB global changes

## Overview

Howler enables your clients to listen for changes to different databases with a single web socket connection. Howler is very scalable as each howler server instance maintains only a single continuous connection with your CouchDB cluster. Each howler server is equal and can therefore more capacity can be added just by adding a new server instance. Many howler clients can connect to a single howler server. The howler server only notifies the howler clients when there is a change to the DBs for which the client has subscribed. This keeps web traffic to a minimum and is a major improvement over listening to the `_global_changes` feed directly from each client.

The applications for howler are vast, but in particular, howler is useful for when you have different PouchDB instances and want only to replicate when a DB has been updated.

### Running the server with Node.js

Install howler:

    $ npm install -g couchdb-howler

Let's assume that your CouchDB instance is accessible via port 443 via HTTPS at db.example.com and that you have an admin user with username `admin` and password `secret`. Let's also assume that we want to run the server on port 3000.

    $ couchdb-howler --couchdb-url https://admin:secret@example.com --port 3000

Note: the system database `_global_changes` must exist. If it doesn't, create it.

### Running the server with Docker Swarm

You can use Docker Swarm to run a cluster of howler servers. For example, you can run 2 server instances with:

    $ docker service create \
      --name howler-server \
      --detach=true \
      --replicas 2 \
      -e --couchdb-url='https://admin:secret@example.com' \
      -e --port='3000' \
      redgeoff/couchdb-howler

### Using howler in a client

Let's assume that you are running the howler server on port 3000 at howler.example.com and that you have a user in the CouchDB `_users` database with username `myuser` and password `mypwd`. The howler client must use a user account to connect to the howler server, however howler does not require the user to have any particular roles.

Here's what your client code may look like:

```js
import Client from 'couchdb-howler'

let client = new Client('http://howler.example.com:3000')

// Listen for changes
client.on('change', dbName => {
  console.log('dbName=%s has changed', dbName)
  // TODO: do something like sync with this DB
})

// Subscribe to some DBs
await client.subscribe('db1')
await client.subscribe('db2')

// Log in with our CouchDB user credentials
await client.logIn('myuser', 'mypwd')
```

You can log in with `client.logIn()` at any time, but you will not receive changes until you do. Upon logging in, howler will automatically create a session cookie named `couchdb-howler-session`. After logging in, subsequent use of the howler client will automatically use this cached cookie until you issue `client.logOut()`. This cookie authentication allows you to only have to authenticate with a username and password once per session--typically when a user logs in via your login form. This session cookie is also used to automatically re-authenticate in the event that the howler client reconnects to the server after a transient error like a dropped network connection.

## [Testing](TESTING.md)

## [Compiling](COMPILING.md)
