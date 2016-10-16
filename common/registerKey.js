var CONS = require('./constants.js')
var globalState = CONS.globalState
var RedisCC = require('./rediscc')

function registerKey(app, field) {
  var url = '/' + field
  app.get(url, function(req, res) {
    if(globalState[field] === undefined) {
      res.status(204)
    }
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.send(globalState[field])
  })
  app.post(url, function(req, res) {
    if(req.body[field] === undefined) {
      res.status(404)
      res.send(`Not received ${field}! Error!`)
    }else{
      RedisCC.client.set(field, req.body[field])
      res.send('received: ' + globalState[field] + '->' + req.body[field])
      globalState[field] = req.body[field]
    }
  })
}

module.exports = registerKey