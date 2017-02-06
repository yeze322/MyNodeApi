var CONS = require('../common/constants')
var redisClient = require('../common/rediscc').client

function _extractUser (req) {
  return req.cookies[CONS.USER_KEY] || '__public'
}

function _extractPayload (req) {
  var payload = req.body
  if (payload) {
    if (typeof payload === 'object') {
      payload = JSON.stringify(payload)
    }
    return payload
  }
  return null
}

// all todo api need user cookie
// TODO: the auth process should execute before request handler, considering using express middleware
function read (req, res) {
  var user = _extractUser(req)
  var field = req.params.key
  redisClient.hget(user, field, (err, rep) => {
    if (rep) {
      res.status(200)
      res.send(rep)
    } else {
      res.status(204)
      res.send()
    }
  })
}

function write (req, res) {
  var payload = _extractPayload(req)
  if (payload) {
    var user = _extractUser(req)
    var field = req.params.key
    // TODO: extract redis save logic
    redisClient.hset(user, field, payload, (err, rep) => {
      if (rep) {
        res.status(200)
        res.send()
      } else {
        res.status(501)
        res.send('redis server cannot save key')
      }
    })
  } else {
    res.status(204)
    res.send()
  }
}

function clear (req, res) {
  var user = _extractUser(req)
  redisClient.hdel(user, req.params.key, (err, rep) => {
    res.status(200)
    res.send()
  })
}

module.exports = {
  read,
  write,
  clear
}