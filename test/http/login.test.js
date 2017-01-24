var expect = require('chai').expect
var server = require('../mockserver')

var agent
before(function () {
  server.start()
  agent = server.getAgent()
})

describe('login api test', function () {
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
    function transformCookie (cookieList) {
      return cookieList.map(x => x.match(/[a-z]+=.*?;/)[0]).join('')
    }
    agent.get('/login?name=test&pswd=test').set('cookie', '').send().end(function (error, response) {
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
  it('Login should success by using previous cookie', function (done) {
    agent.get('/login?name=test&pswd=tsss').set('cookie', shareCookie).send().end(function (error, response) {
      expect(error).to.be.null
      expect(response.text).to.equal('true')
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
