var redis = require('redis')

var client = redis.createClient({
  host: 'yeze.eastasia.cloudapp.azure.com',
  port: 3456
})

module.exports = {
  client
}