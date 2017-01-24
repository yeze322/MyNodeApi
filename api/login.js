var sha1 = require('sha1')
var RedisCC = require('../common/rediscc.js')
var CONS = require('../common/constants.js')

var client = RedisCC.client
const TrustSiteDic = CONS.TrustSiteDic
const COOKIE_KEY = CONS.COOKIE_KEY
const USER_KEY = CONS.USER_KEY
const TTL = CONS.RedisConf.EXP_TIME

function _IS_FROM_MOCHA_TEST_ENV (req) {
  var ua = req.headers['user-agent']
  return ua !== undefined && ua.indexOf('node-superagent') > -1
}
function _IS_PROD_ENV () {
  return require('os').hostname() === 'yezeubuntu'
}
function _IS_FROM_POSTMAN (req) {
  return !!req.headers['postman-token']
}

function _CHECK_ORIGIN_TRUST(req, res) {
  console.log('origin', req.headers)
  if (req.headers.origin in TrustSiteDic) {
    // enable AJAX CORS for trust sites
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin)
    res.setHeader('Access-Control-Allow-Credentials', true)
    return true
  } else if (!_IS_PROD_ENV() && (_IS_FROM_MOCHA_TEST_ENV(req) || _IS_FROM_POSTMAN(req))) {
    return true
  }
  return false
}

function redisSetPair (k, v) {
  client.set(k, v)
  client.expire(k, TTL)
}

function _CHECK_LOGIN(req, res) {
  var checked = CONS.userAccountMap[req.query.name] && CONS.userAccountMap[req.query.name].password === req.query.pswd
  if(checked) {
    var token = sha1(req.query.name + '|' + Math.random())
    redisSetPair(token, req.query.name)
    res.cookie(COOKIE_KEY, token)
    res.cookie(USER_KEY, req.query.name)
    return true
  }
  return false
}

function login(req, res) {
  if (_CHECK_ORIGIN_TRUST(req, res) === false) {
    res.status(403)
    res.send(null)
    return
  }

  var token = req.cookies[COOKIE_KEY]

  // no token, check pswd & username
  if (!token){
    res.send(_CHECK_LOGIN(req, res))
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
      res.send(_CHECK_LOGIN(req, res))
    }
  })
  return
}

function logout(req, res) {
  if (_CHECK_ORIGIN_TRUST(req, res)) {
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