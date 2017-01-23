require('app-module-path').addPath(__dirname + '/../../')

var chai = require('chai')
chai.use(require('chai-http'))
var expect = chai.expect

var server
var agent
before(function () {
  server = require('server')
  agent = chai.request.agent(server)
})

describe('Basic user name API test', function () {
  it('[GET] should return 200', function (done) {
    agent.get('/name').send().end(function (err, res) {
      expect(err).to.be.null
      expect(res).to.have.status(200)
      done()
    })
  })
  var tempName = Math.random().toString()
  it('[POST] -> 200 & res.text contains "received"', function (done) {
    agent.post('/name').send({ name: tempName }).end(function (err, res) {
      expect(err).to.be.null
      expect(res).to.have.status(200)
      expect(res.text).to.contain('received:')
      done()
    })
  })
  it('[GET] user name shoulbe be updated', function (done) {
    agent.get('/name').send().end(function (err, res) {
      expect(err).to.be.null
      expect(res.text).to.equal(tempName)
      done()
    })
  })
})

after(function () {
  server.close()
})