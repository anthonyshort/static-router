location = 
  host: "github.com"
  hostname: "github.com"
  href: "https://github.com/anthonyshort/static-router"
  origin: "https://github.com"
  pathname: "/anthonyshort/static-router"
  port: ""
  protocol: "https:"
  search: ""

Router = require('static-router')

describe 'Static Router', ->

  beforeEach ->
    @router = new Router

  it 'should set a url and normalize it', ->
    router = new Router()
    router.setUrl('/foo');
    expect(router.url).to.equal('/foo/')
    router.setUrl('foo/bar');
    expect(router.url).to.equal('/foo/bar/')
    router.setUrl('foo/');
    expect(router.url).to.equal('/foo/')

  it 'should set a root url in any format and normalize it', ->
    router = new Router()
    router.setRoot('/foo');
    expect(router.root).to.equal('/foo/')
    router.setRoot('foo');
    expect(router.root).to.equal('/foo/')
    router.setRoot('foo/');
    expect(router.root).to.equal('/foo/')

  it 'should get the fragment when there is no root set', ->
    router = new Router()
    router.setUrl('/foo/bar/baz')
    expect(router.getFragment()).to.equal('/foo/bar/baz')

  it 'should get the fragment when there is a root set', ->
    router = new Router()
    router.setUrl('/foo/bar/baz')
    router.setRoot('/foo');
    expect(router.getFragment()).to.equal('/bar/baz')

  it 'should add a route and match it', ->
    matched = false
    @router.setUrl '/test/route'
    @router.route '/test/route', -> matched = true
    expect(matched).to.equal(true)

  it 'should add a route without a leading slash and not match it', ->
    matched = false
    @router.setUrl '/test/route'
    @router.route 'test/route', -> matched = true
    expect(matched).to.equal(false)

  it 'should add a route without a leading slash and a root and not match it', ->
    matched = false
    @router.setRoot '/foo'
    @router.setUrl '/foo/test/route'
    @router.route 'test/route', -> matched = true
    expect(matched).to.equal(false)

  it 'should add a route with a root and match it', ->
    matched = false
    @router.setRoot '/foo'
    @router.setUrl '/foo/test/route'
    @router.route '/test/route', -> matched = true
    expect(matched).to.equal(true)

  it 'should match any route with just a wildcard', ->
    matched = false
    @router.setUrl '/foo/test/route'
    @router.route '*', -> matched = true
    expect(matched).to.equal(true)

  it 'should add a route with params', ->
    matched = false
    @router.setUrl '/test/foo/bar'
    @router.route '/test/:param/:another', (param, another) -> 
      matched = true
      expect(param).to.equal 'foo'
      expect(another).to.equal 'bar'
    expect(matched).to.equal(true)

  it 'should add a route with wildcards', ->
    matched = false
    @router.setUrl '/file/nested/folder/file.txt'
    @router.route "/file/*", (path) ->
      matched = true
      expect(path).to.equal 'nested/folder/file.txt'
    expect(matched).to.equal(true)
