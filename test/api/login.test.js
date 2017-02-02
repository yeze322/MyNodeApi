var expect = require('chai').expect
var server = require('../mockserver')
var extractCookieString  = require('../utils').extractCookieString

var agent
before(function () {
  agent = server.start()
})

describe('login single api basic test', function () {
  var shareCookie
  it('Login should get 401 when post wrong account', function (done) {
    agent.simulateLogin('test', 'wrong').end(function (error, response) {
      expect(response).to.have.status(401)
      expect(response.text).to.equal('wrong password')
      done()
    })
  })
  it('Login should get 200 when post correct account', function (done) {
    agent.simulateLogin('test', 'test').end(function (error, response) {
      expect(error).to.be.null
      expect(response).to.have.status(200)
      expect(response.text).to.equal('true')
      shareCookie = extractCookieString(response)
      done()
    })
  })
  after(function () {
    return agent.simulateLogout(shareCookie)
  })
})

describe('login cookie & priority combined test', function () {
  var shareCookie
  it('success login should set cookie', function (done) {
    agent.simulateLogin('test', 'test').end(function (error, response) {
      expect(error).to.be.null
      expect(response).to.have.status(200)
      expect(response.text).to.equal('true')
      expect(response).to.have.cookie('uatoken')
      expect(response).to.have.cookie('user')
      var cookies = response.header['set-cookie']
      expect(cookies.find(x => x.indexOf('user=') > -1)).to.equal('user=test; Path=/')
      shareCookie = extractCookieString(response)
      done()
    })
  })
  it('Login heartbeat protocol should work', function (done) {
    agent.simulateLogin(null, null, shareCookie).end(function (error, response) {
      expect(error).to.be.null
      expect(response).to.have.status(200)
      expect(response.text).to.equal('true')
      done()
    })
  })
  it('username & password should be handled before cookie', function (done) {
    agent.simulateLogin('test', 'wrong', shareCookie).end(function (error, response) {
      expect(response).to.have.status(401)
      expect(response.text).to.equal('wrong password')
      done()
    })
  })
  after(function () {
    return agent.simulateLogout(shareCookie)
  })
})

after(function (done) {
  server.close()
  done()
})
