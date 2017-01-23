var redis = require('redis')

var client = redis.createClient({
  host:  require('./constants').machineHostMap[require('os').hostname()],
  port: 3456
})

module.exports = {
  client
}