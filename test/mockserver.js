require('app-module-path').addPath(__dirname + '/../')

var chai = require('chai')
chai.use(require('chai-http'))

function randInt (min, max) {
  min = min || 0
  max = max || 1000
  return Math.floor(Math.random() * (max - min) + min)
}

function simulateLogin (username, password, cookie) {
  var url = (!!username && !!password) ? `/login?name=${username}&pswd=${password}` : '/login'
  return this.post(url)
    .set('cookie', cookie || '')
    .send({ username, password })
}

var server = (function () {
  var _server
  var _agent
  return {
    start: function (port) {
      if (port === undefined){
        port = randInt(3300, 8887)
      }
      _server = require('app').listen(port, () => { console.log('test server running on %s', port) })      
      return this.getAgent()
    },
    getAgent: function () {
      if (_agent === undefined) {
        _agent = chai.request.agent(_server)
        _agent.simulateLogin = simulateLogin
      }
      return _agent
    },
    close: function () {
      _server.close()
    }
  }
})()

module.exports = server