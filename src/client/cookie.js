import jsCookie from 'js-cookie'
import nodeCookie from './node-cookie'

// js-cookie doesn't actually store anything in node so we create an abstraction so that cookies
// will work in node. This is needed so that if we use the client in node, it can reconnect to the
// server with the cookie and not a username and password
class Cookie {
  getProvider (inBrowser) {
    return inBrowser ? jsCookie : nodeCookie
  }
}

module.exports = new Cookie()
