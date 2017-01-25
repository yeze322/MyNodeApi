var sha1 = require('sha1')
var RedisCC = require('../common/rediscc.js')
var CONS = require('../common/constants.js')
var CHECK_ORIGIN_TRUST = require('./CROSUtil').CHECK_ORIGIN_TRUST

var client = RedisCC.client
const COOKIE_KEY = CONS.COOKIE_KEY
const USER_KEY = CONS.USER_KEY
const TTL = CONS.RedisConf.EXP_TIME

function redisSetPair (k, v) {
  client.set(k, v)
  client.expire(k, TTL)
}

function _checkPassword(username, password) {
  var checked = CONS.userAccountMap[username] && CONS.userAccountMap[username].password === password
  return checked
}

function _registerLoginCookie(username, res) {
  var token = sha1(username + '|' + Math.random())
  redisSetPair(token, username)
  res.cookie(COOKIE_KEY, token)
  res.cookie(USER_KEY, username)
}

function _extractUserInfo(req) {
  var ret
  if (req.query && req.query.name && req.query.pswd) {
    ret = {
      name: req.query.name,
      password: req.query.pswd
    }
  }
  return ret
}

function FORBID (res) {
  res.status(403)
  res.send()
}

function DENY (res) {
  res.status(401)
  res.send(false)
}

function ACCEPT (res) {
  res.status(200)
  res.send(true)
}

function login(req, res) {
  // enable CROS for trust site
  if (CHECK_ORIGIN_TRUST(req, res) === false) {
    FORBID(res)
    return
  }
  // check user info first
  var user = _extractUserInfo(req)
  if (user) {
    if (_checkPassword(user.name, user.password)){
      _registerLoginCookie(user.name, res)
      ACCEPT(res)
    } else {
      // TODO: status should be 403 if login failed
      DENY(res)
    }
    return
  }
  // if no user info, check cookie
  var token = req.cookies[COOKIE_KEY]
  if (!token){
    // no token, denied
    DENY(res)
  } else {
    // has token, check its avalability
    //TODO: this token logic has problem, should optimize the redis logic
    //    multi token can pass auth at the same time
    client.get(token, (err, rep) => {
      if(rep){
        client.expire(COOKIE_KEY, TTL)
        ACCEPT(res)
      }else{
        DENY(res)
      }
    })
  }
}

function logout(req, res) {
  if (CHECK_ORIGIN_TRUST(req, res)) {
    client.del(req.cookies[COOKIE_KEY])
    res.cookie(USER_KEY, '')
    res.status(200)
    res.send('cookies clear')
  }else{
    FORBID(res)
  }
}

function supervisor(req, res) {
  console.log(req.headers.origin)
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin)
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.cookie('sptest', sha1(Math.random()))
  res.send(req.headers)
}

module.exports = {
  login,
  logout,
  supervisor
}