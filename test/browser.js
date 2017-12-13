import './chai'
import './node-and-browser'
import Foo from '../src'

describe('node', () => {
  it('should test only in node', async () => {
    // TODO: insert tests that can only be tested in the browser
    let foo = new Foo()
    let thing = await foo.bar()
    thing.should.eql('yar')
  })
})
