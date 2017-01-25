var expect = require('chai').expect
var server = require('../mockserver')
var transformCookie  = require('../utils').transformCookie

var agent
before(function () {
  agent = server.start()
})

describe('login api test', function () {
  var shareCookie
  it('Login should failed when post wrong account', function (done) {
    agent.simulateLogin('test', 'wrong').end(function (error, response) {
      expect(error).to.be.null
      expect(response.text).to.equal('false')
      done()
    })
  })
  it('Login should sucess when post correct account', function (done) {
    agent.simulateLogin('test', 'test').end(function (error, response) {
      expect(error).to.be.null
      expect(response.text).to.equal('true')
      done()
    })
  })
  it('success login should set cookie', function (done) {
    agent.simulateLogin('test', 'test').end(function (error, response) {
      expect(error).to.be.null
      expect(response.text).to.equal('true')
      expect(response).to.have.cookie('uatoken')
      expect(response).to.have.cookie('user')
      var cookies = response.header['set-cookie']
      expect(cookies.find(x => x.indexOf('user=') > -1)).to.equal('user=test; Path=/')
      shareCookie = transformCookie(cookies)
      done()
    })
  })
  it('Login heartbeat protocol should work', function (done) {
    agent.simulateLogin(null, null, shareCookie).end(function (error, response) {
      expect(error).to.be.null
      expect(response.text).to.equal('true')
      done()
    })
  })
})

after(function (done) {
  server.close()
  done()
})
