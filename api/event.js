var RedisCC = require('../common/rediscc.js')
var CONS = require('../common/constants.js')

var client = RedisCC.client
const USER_KEY = CONS.USER_KEY
const GLOBAL_TTL = CONS.RedisConf.EXP_TIME
const TrustSiteDic = CONS.TrustSiteDic

function ALLOW_TRUST_SITE(req, res) {
  if (req.headers.origin in TrustSiteDic) {
    // enable AJAX CORS for trust sites
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin)
    res.setHeader('Access-Control-Allow-Credentials', true)
  }
}

function getEventStatus(req, res) {
  ALLOW_TRUST_SITE(req, res)
  var eventName = req.params.eventName
  var userName = req.cookies[USER_KEY]
  client.get(eventName, (err, rep) => {
    if(rep && rep === userName) {
      res.status(200)
      res.send(true)
    }else{
      res.status(204)
      res.send()
    }
  })
}

function onOpenEvent(req, res) {
  ALLOW_TRUST_SITE(req, res)
  var eventName = req.params.eventName
  var ttl = req.params.ttl || GLOBAL_TTL
  var userName = req.cookies[USER_KEY]
  if (!userName) {
    res.status(401)
    res.send('no user token, denied!')
    return
  }
  client.get(eventName, (err, rep) => {
    if(!rep){
      client.set(eventName, userName)
      client.expire(eventName, ttl)
      res.status(201)
      res.send(`register ${eventName} to user ${userName}`)
    }else if(rep === userName){
      res.status(205)
      client.expire(eventName, ttl)
      res.send(`update ttl ${userName}:${eventName}`)
    }else{
      res.status(200)
      res.send(true)
      client.del(eventName)
    }
  })
  return
}

function onCloseEvent(req, res) {
  ALLOW_TRUST_SITE(req, res)
  var eventName = req.params.eventName
  var userName = req.cookies[USER_KEY]
  if (!userName) {
    res.status(401)
    res.send('no user token, denied!')
    return
  }
  client.get(eventName, (err, rep) => {
    if (!rep) {
      res.status(400)
      res.send(`event=${eventName} not exists or already expired.`)
    } else if (rep === userName) {
      res.status(200)
      res.send(`remove success! event=${eventName}`)
      client.del(eventName)
    } else {
      res.status(400)
      res.send(`you want to close an event ${eventName} not owned by you`)
    }
  })
  return
}
module.exports = {
  getEventStatus,
  onOpenEvent,
  onCloseEvent
}