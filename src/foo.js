class Foo {
  constructor () {
    this._thing = 'yar'
  }

  bar () {
    return Promise.resolve(this._thing)
  }
}

module.exports = Foo
