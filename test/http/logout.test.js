var expect = require('chai').expect
var server = require('../mockserver')
var transformCookie  = require('../utils').transformCookie

var agent
before(function () {
  agent = server.start()
})

describe('Logout api should work', function () {
  var shareCookie2
  before(function (done) {
    agent.get('/login?name=test&pswd=test').set('cookie', '').send().end((error, response) => {
      shareCookie2 = transformCookie(response.header['set-cookie'])
      done()
    })
  })
  it('login heartbeat success before logout', function (done) {
    agent.get('/login').set('cookie', shareCookie2).send().end(function (error, response) {
      expect(error).to.is.null
      expect(response.text).to.equal('true')
      done()
    })
  })
  it('logout should return 200 & reset cookie', function (done) {
    agent.post('/logout').set('cookie', shareCookie2).send().end(function (error, response) {
      expect(error).to.is.null
      expect(response).to.have.status(200)
      //TODO: logout should check if cookie is existing
      expect(response.header['set-cookie']).to.include('user=; Path=/')
      done()
    })
  })
  it('cookie should expired after logout', function (done) {
    agent.get('/login').set('cookie', shareCookie2).send().end(function (error, response) {
      expect(error).to.is.null
      expect(response.text).to.equal('false')
      done()
    })
  })
})

after(function (done) {
  server.close()
  done()
})
