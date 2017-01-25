var expect = require('chai').expect
var server = require('../mockserver')
var transformCookie = require('../utils').transformCookie

var agent
before(function() {
  agent = server.start()
})

describe('event api should work fine', function () {
  var shareCookie
  var shareEventName
  before(function (done) {
    agent.get('/login?name=test&pswd=test').set('cookie', '').send().end(function (error, response) {
      shareCookie = transformCookie(response.header['set-cookie'])
      shareEventName = Math.random().toString()
      done()
    })
  })
  it('[GET] non-existing event should return 204', function (done) {
    agent.get(`/event/${shareEventName}`).set('cookie', shareCookie).send().end(function (error, response) {
      expect(response).to.have.status(204)
      done()
    })
  })
  it('[POST] close non-existing event should return 400', function (done) {
    agent.post(`/eventoff/${shareEventName}`).set('cookie', shareCookie).send().end(function (error, response) {
      expect(response).to.have.status(400)
      expect(response.text).to.include(`${shareEventName} not exists or already expired`)
      done()
    })
  })
  it('[POST] new event should return 201', function (done) {
    agent.post(`/eventon/${shareEventName}`).set('cookie', shareCookie).send().end(function (error, response) {
      expect(response).to.have.status(201)
      expect(response.text).to.include(shareEventName)
      done()
    })
  })
  it('[POST] a duplicate event again should return 205', function (done) {
    agent.post(`/eventon/${shareEventName}`).set('cookie', shareCookie).send().end(function (error, response) {
      expect(response).to.have.status(205)
      expect(response.text).to.include(shareEventName)
      done()
    })
  })
  it('[GET] existing event should return 200 and reply "true"', function (done) {
    agent.get(`/event/${shareEventName}`).set('cookie', shareCookie).send().end(function (error, response) {
      expect(response).to.have.status(200)
      expect(response.text).to.equal('true')
      done()
    })
  })
  it('[POST] close existing event should return 200', function (done) {
    agent.post(`/eventoff/${shareEventName}`).set('cookie', shareCookie).send().end(function (error, response) {
      expect(response).to.have.status(200)
      expect(response.text).to.include('remove success')
      done()
    })
  })
  after(function (done) {
    agent.post('/logout').set('cookie', shareCookie).send().end(() => { done() })
  })
})

after(function (done) {
  server.close()
  done()
})