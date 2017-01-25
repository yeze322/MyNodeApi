var expect = require('chai').expect
var server = require('../mockserver')
var extractCookieString = require('../utils').extractCookieString

var agent
before(function() {
  agent = server.start()
})

describe('event api should work fine', function () {
  var shareCookie
  var shareEventName
  before(function (done) {
    shareEventName = Date.now().toString()
    agent.simulateLogin('test', 'test').end(function (error, response) {
      shareCookie = extractCookieString(response)
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
  it('[POST] event withoud user token should falied and return 401', function (done) {
    var cookieWithoutUser = shareCookie.replace(/(user=.+?;)/, '')
    agent.post(`/eventon/${shareEventName}`).set('cookie', cookieWithoutUser).send().end(function (error, response) {
      expect(response).to.have.status(401)
      expect(response.text).to.include('denied')
      done()
    })
  })
  after(function (done) {
    agent.post('/logout').set('cookie', shareCookie).send().end(() => { done() })
  })
})

describe('multi user event interaction validation', function () {
  var cookie1, cookie2
  before(function (done) {
    agent.simulateLogin('test', 'test').end(function (error, response) {
      cookie1 = extractCookieString(response)
    })
    agent.simulateLogin('test1', 'test1').end(function (error, response) {
      cookie2 = extractCookieString(response)
      done()
    })
  })
  it('if two user post a same event, should paired success', function () {
    var eventName = Date.now().toString()
    var eventUrl = `/eventon/${eventName}`
    return agent.post(eventUrl).set('cookie', cookie1).send()
      .then(response => { expect(response).to.have.status(201) })
      .then(() => {
        return agent.post(eventUrl).set('cookie', cookie2).send().then(response => {
          expect(response).to.have.status(200)
          expect(response.text).to.equal('true')
        })
      })
    .then(() => {
      return agent.get('/event/' + eventName).set('cookie', cookie1).send().then(response => {
        expect(response).to.have.status(204)
      })
    })
  })
  describe('close another user\'s event', function () {
    var eventName = Date.now().toString()
    it('should failed and return 400', function () {
      return agent.post('/eventon/' + eventName).set('cookie', cookie1).send()
        .then(response => { expect(response).to.have.status(201) })
        .then(() => {
          return agent.post('/eventoff/' + eventName).set('cookie', cookie2).send()
            .then(response => {
              throw '[Exception]: should return 400'
            })
            .catch(err => {
              expect(err).to.have.status(400)
              expect(err.response.text).to.include('not owned by you')
            })
        })
    })
    after(function (done) {
      agent.post('/eventoff/' + eventName).set('cookie', cookie1).send().end(() => { done() })
    })
  })
  after(function (done) {
    agent.post('/logout').set('cookie', cookie1).send().end()
    agent.post('/logout').set('cookie', cookie2).send().end(() => { done() })
  })
})

after(function (done) {
  server.close()
  done()
})