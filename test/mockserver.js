require('app-module-path').addPath(__dirname + '/../')

var chai = require('chai')
chai.use(require('chai-http'))

var server = (function () {
  var _server
  var _agent
  return {
    start: function (port) {
      if (port === undefined){
        port = 8080
      }
      _server = require('app').listen(port, () => { console.log('test server running on 7777') })      
    },
    getAgent: function () {
      if (_agent === undefined) {
        _agent = chai.request.agent(_server)
      }
      return _agent
    },
    close: function () {
      _server.close()
    }
  }
})()

module.exports = server