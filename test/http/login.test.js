var expect = require('chai').expect
var server = require('../mockserver')
var transformCookie  = require('../utils').transformCookie

var agent
before(function () {
  agent = server.start()
})

describe('login api test', function () {
  var shareCookie1
  it('Login should failed when post wrong account', function (done) {
    agent.get('/login?name=test&pswd=test2').set('cookie', '').send().end(function (error, response) {
      expect(error).to.be.null
      expect(response.text).to.equal('false')
      done()
    })
  })
  it('Login should sucess when post correct account', function (done) {
    agent.get('/login?name=test&pswd=test').set('cookie', '').send().end(function (error, response) {
      expect(error).to.be.null
      expect(response.text).to.equal('true')
      done()
    })
  })
  it('success login should set cookie', function (done) {
    agent.get('/login?name=test&pswd=test').set('cookie', '').send().end(function (error, response) {
      expect(error).to.be.null
      expect(response.text).to.equal('true')
      expect(response).to.have.cookie('uatoken')
      expect(response).to.have.cookie('user')
      var cookies = response.header['set-cookie']
      expect(cookies.find(x => x.indexOf('user=') > -1)).to.equal('user=test; Path=/')
      shareCookie1 = transformCookie(cookies)
      done()
    })
  })
  it('Login should success by using previous cookie', function (done) {
    agent.get('/login?name=test&pswd=tsss').set('cookie', shareCookie1).send().end(function (error, response) {
      expect(error).to.be.null
      expect(response.text).to.equal('true')
      var cookies = response.header['set-cookie']
      done()
    })
  })
  it('Login heartbeat protocol should work', function (done) {
    agent.get('/login').send().end(function (error, response) {
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
