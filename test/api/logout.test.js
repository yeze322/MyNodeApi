var expect = require('chai').expect
var server = require('../mockserver')
var extractCookieString  = require('../utils').extractCookieString

var agent
before(function () {
  agent = server.start()
})

describe('Logout api should work', function () {
  var shareCookie
  before(function (done) {
    agent.simulateLogin('test', 'test').end((error, response) => {
      shareCookie = extractCookieString(response)
      done()
    })
  })
  it('login heartbeat success before logout', function (done) {
    agent.simulateLogin(null, null, shareCookie).end(function (error, response) {
      expect(error).to.is.null
      expect(response.text).to.equal('true')
      done()
    })
  })
  it('logout should return 200 & reset cookie', function (done) {
    agent.post('/logout').set('cookie', shareCookie).send().end(function (error, response) {
      expect(error).to.is.null
      expect(response).to.have.status(200)
      //TODO: logout should check if cookie is existing
      expect(response.header['set-cookie']).to.include('user=; Path=/')
      done()
    })
  })
  it('cookie should expired after logout', function (done) {
    agent.simulateLogin(null, null, shareCookie).end(function (error, response) {
      expect(response).to.have.status(401)
      expect(response.text).to.equal('false')
      done()
    })
  })
})

after(function (done) {
  server.close()
  done()
})
