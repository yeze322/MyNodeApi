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

function _checkLogin(username, password) {
  var checked = CONS.userAccountMap[username] && CONS.userAccountMap[username].password === password
  return checked
}

function _registerLoginCookie(req, res) {
  var token = sha1(req.query.name + '|' + Math.random())
  redisSetPair(token, req.query.name)
  res.cookie(COOKIE_KEY, token)
  res.cookie(USER_KEY, req.query.name)
}

function _extractUserInfo(req) {
  return {
    name: req.query.name,
    password: req.query.pswd
  }
}

function _tryLogin(req, res) {
  var user = _extractUserInfo(req)
  var checked = _checkLogin(user.name, user.password)
  if (checked) {
    _registerLoginCookie(req, res)
    res.send(true)
  } else {
    // TODO: status should be 403 if login failed
    res.send(false)
  }
}

function login(req, res) {
  if (CHECK_ORIGIN_TRUST(req, res) === false) {
    res.status(403)
    res.send(null)
    return
  }

  var token = req.cookies[COOKIE_KEY]

  // no token, check pswd & username
  if (!token){
    _tryLogin(req, res)
    return
  }

  // has token, check its avalability
  //TODO: this token logic has problem, should optimize the redis logic
  //    multi token can pass auth at the same time
  client.get(token, (err, rep) => {
    if(rep){
      client.expire(COOKIE_KEY, TTL)
      res.send(true)
    }else{
      _tryLogin(req, res)
      return
    }
  })
  return
}

function logout(req, res) {
  if (CHECK_ORIGIN_TRUST(req, res)) {
    client.del(req.cookies[COOKIE_KEY])
    res.cookie(USER_KEY, '')
    res.status(200)
    res.send('cookies clear')
  }else{
    res.status(403)
    res.send(null)
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