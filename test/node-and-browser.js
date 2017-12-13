import 'babel-polyfill'
import Foo from '../src'

describe('node and browser', () => {
  it('should test in both node and the browser', async () => {
    // TODO: insert tests that can be tested in both node and the browser
    let foo = new Foo()
    let thing = await foo.bar()
    thing.should.eql('yar')
  })
})
