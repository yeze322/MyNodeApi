var expect = require('chai').expect
var server = require('../mockserver')

function transformCookie (cookieList) {
  return cookieList.map(x => x.match(/[a-z]+=.*?;/)[0]).join('')
}

var agent
before(function () {
  server.start()
  agent = server.getAgent()
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

describe('Logout api should work', function (done) {
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
