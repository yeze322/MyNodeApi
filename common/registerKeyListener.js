var CONS = require('./constants.js')
var RedisCC = require('./rediscc')
var redis = require('redis')

function registerKeyListener(app, field) {
  var url = '/' + field
  app.get(url, function(req, res) {
    RedisCC.client.get(field, (err, rep) => {
      if(rep === null) {
        res.status(204)
        res.send()
      }else{
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.send(rep)
      }
    })
  })
  app.post(url, function(req, res) {
    if(req.body[field] === undefined) {
      res.status(404)
      res.send(`Not received ${field}! Error!`)
    }else{
      RedisCC.client.set(field, req.body[field])
      res.send('received: ' + req.body[field])
    }
  })
}

module.exports = registerKeyListener