# couchdb-howler

[![Circle CI](https://circleci.com/gh/redgeoff/couchdb-howler.svg?style=svg&circle-token=9149c22bf1b5236c7a56bc72a38b2f48947a8716)](https://circleci.com/gh/redgeoff/couchdb-howler) [![Greenkeeper badge](https://badges.greenkeeper.io/redgeoff/couchdb-howler.svg)](https://greenkeeper.io/)

Use web sockets to subscribe to CouchDB global changes

## Overview

Howler enables your clients to listen for changes to different databases with a single web socket connection. Howler is very scalable as each howler server instance maintains only a single continuous connection with your CouchDB cluster. Each howler server instance is equal and therefore more capacity can be added just by adding a new server instance. Many howler clients can connect to a single howler server. The howler server only notifies a howler client when there is a change to the DBs for which the client has subscribed--this keeps web traffic to a minimum and is a major improvement over having each client listen directly to the `_global_changes` feed.

The applications for howler are vast, but in particular, howler is useful for when you have different PouchDB instances and want only to replicate when a DB has been updated. This is particularly relevant when you have multiple PouchDB instances listening for changes and need to avoid exhausting the limited DB and browser connections that would otherwise be needed to maintain continous replications.

### Running the server with Node.js

Install howler:

    $ npm install -g couchdb-howler

Let's assume that your CouchDB instance is accessible via port 443 via HTTPS at db.example.com and that you have an admin user with username `admin` and password `secret`. Let's also assume that we want to run the server on port 3000.

    $ couchdb-howler --couchdb_url https://admin:secret@example.com --port 3000

Note: the system database `_global_changes` must exist. If it doesn't, create it.

### Running the server with Docker Swarm

You can use Docker Swarm to run a cluster of howler servers. For example, you can run 2 server instances at howler.example.com on port 3000 with the following:

1. Create the network:
```
$ docker network create \
    --driver overlay \
    --subnet 10.0.9.0/24 \
    --opt encrypted \
    howler-network
```
2. Create a [traefik](https://traefik.io) service as sticky sessions are needed for the web sockets:
```
$ docker service create \
    --name traefik \
    --detach=true \
    --constraint=node.role==manager \
    --mount type=bind,source=/var/run/docker.sock,target=/var/run/docker.sock \
    --network=howler-network \
    -p 3000:80 \
    -p 8080:8080 \
    traefik \
  --docker \
  --docker.swarmmode \
  --docker.domain="example.com" \
  --docker.watch \
  --loglevel=DEBUG \
  --web
```
3. Create the howler service:
```
$ docker service create \
  --name howler \
  --detach=true \
  --replicas 2 \
  --network=howler-network \
  --label traefik.frontend.rule="Host:howler.exmaple.com" \
  --label traefik.port=80 \
  --label traefik.backend.loadbalancer.sticky=true \
  -e --couchdb_url='https://admin:secret@example.com' \
  -e --port=80 \
  redgeoff/couchdb-howler
```

Note: to check the version with Docker you'll need to use `version=true`, e.g.

    $ docker run -it -e version=true redgeoff/couchdb-howler
    
Upgrade to latest image:

    $ docker pull redgeoff/couchdb-howler
    $ docker service update --detach=true --image redgeoff/couchdb-howler howler

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

The subscriptions persist through reconnects. In the event that the client does reconnect, it will automatically re-subscribe to the DBs for which is was subscribed before losing the connection. If you subscribe to any DBs while the client is not connected to the server, the client will automatically send the subscriptions to the server when a connection is established.

## Server Usage

```
Usage: server.js [options]

Options:
  -p, --port         Port                                        [default: 3000]
  -l, --log_level    error|warn|info|debug. Setting a particular level implies
                     that all log records at that level and above are logged.
                                                               [default: "info"]
  -h, --help         Show help                                         [boolean]
  -u, --couchdb_url  URL to the CouchDB cluster                       [required]
  -v, --version      Show version number                               [boolean]

Examples:
  server.js --couchdb_url https://admin:admin@localhost:5984 --port 3000
```

## [Testing](TESTING.md)

## [Compiling](COMPILING.md)

## [Building](BUILDING.md)
