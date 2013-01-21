describe 'Static Router', ->

  beforeEach ->
    @router = new Router
      location: 
        host: "github.com"
        hostname: "github.com"
        href: "https://github.com/anthonyshort/static-router"
        origin: "https://github.com"
        pathname: "/anthonyshort/static-router"
        port: ""
        protocol: "http:"
        search: ""

  it 'should '