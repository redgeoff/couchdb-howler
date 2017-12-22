// We import babel-polyfill here so that external projects don't have to depend on the polyfill
// directly. This way, the babel-polyfill dependency stays at the howler layer.
import 'babel-polyfill'
import Server from './server'

module.exports = Server
