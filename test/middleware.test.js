var expect = require('chai').expect
var server = require('./mockserver')
var extractCookieString  = require('./utils').extractCookieString
var agent

before(function () {
  agent = server.start()
})

describe('Auth step should run before api handler.', function () {
  it('Test api should return 401 without cookie.', function (done) {
    agent.get('/test/auth').set('cookie', '').send().end(function (err, res) {
      expect(res).to.have.status(401)
      expect(res.text).to.equal('auth failed, no token.')
      done()
    })
  })
  describe('Wrap test case with login.', function () {
    var cookie
    before(function (done) {
      agent.simulateLogin('test', 'test').end(function (err, res) {
        cookie = extractCookieString(res)
        done()
      })
    })
    it('Auth should failed with wrong username.', function (done){
      var fakeCookie = cookie.replace(/user=.+?;/, 'user=wrong;')
      agent.get('/test/auth').set('cookie', fakeCookie).send().end(function (err, res) {
        expect(res).to.have.status(401)
        expect(res.text).to.equal('auth failed, token not match.')
        done()
      })
    })
    it('Auth should pass with right cookie.', function (done) {
      agent.get('/test/auth').set('cookie', cookie).send().end(function (err, res) {
        expect(res).to.have.status(200)
        done()
      })
    })
    after(function (done) {
      agent.simulateLogout(cookie).end(() => {done()})
    })
  })
})

after(function (done) {
  server.close()
  done()
})