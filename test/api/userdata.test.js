var expect = require('chai').expect
var server = require('../mockserver')
var extractCookieString = require('../utils').extractCookieString

var agent
before(function () {
  agent = server.start()
})

describe('Functional test for user specific data storage API.', function () {
  var cookie
  var url = '/user/ut'
  before(function (done) {
    agent.simulateLogin('test', 'test').end((err, res) => {
      cookie = extractCookieString(res)
      done()
    })
  })
  it('Save an object should success.', function (done) {
    var testObj = {
      name: 'obj1',
      value: 1234
    }
    agent.post(url).send(testObj).end((err, res) => {
      expect(res).to.have.status(200)
      agent.get(url).send().end((err, res) => {
        expect(res).to.have.status(200)
        expect(res.text).to.equal(JSON.stringify(testObj))
        done()
      })
    })
  })
  it('Modify object should work.', function (done) {
    var newObj = ['val1', 'val2']
    agent.post(url).send(newObj).end((err, res) => {
      expect(res).to.have.status(200)
      agent.get(url).send().end((err, res) => {
        expect(res).to.have.status(200)
        expect(res.text).to.equal(JSON.stringify(newObj))
        done()
      })
    })
  })
  it('Delete object should word.', function (done) {
    agent.delete(url).send().end((err, res) => {
      expect(res).to.have.status(200)
      agent.get(url).send().end((err, res) => {
        expect(res).to.have.status(204)
        done()
      })
    })
  })
  it('Get object without cookie should be denied.', function (done) {
    agent.post(url).set('cookie', '').send().end((err, res) => {
      expect(res).to.have.status(401)
      done()
    })
  })
  after(function (done) {
    agent.simulateLogout(cookie).end(() => {done()})
  })
})

after(function (done) {
  server.close()
  done()
})