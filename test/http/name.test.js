var expect = require('chai').expect
var server = require('../mockserver')

var agent
before(function () {
  server.start(7777)
  agent = server.getAgent()
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

after(function (done) {
  console.log('name API test finished!')
  agent.post('/name').send({ name: 'jimmy' }).end(function (err, res) {
    done()
    server.close()
  })
})