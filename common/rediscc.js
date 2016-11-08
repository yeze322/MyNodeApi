var redis = require('redis')

var client = redis.createClient({
  host: 'localhost',
  port: 3456
})

module.exports = {
  client
}