var sha1 = require('sha1')
var RedisCC = require('../common/rediscc.js')
var CONS = require('../common/constants.js')

const TrustSiteDic = CONS.TrustSiteDic
const COOKIE_KEY = CONS.COOKIE_KEY

function _CHECK_ORIGIN_TRUST(req, res) {
  if (req.headers.origin in TrustSiteDic) {
    // enable AJAX CORS for trust sites
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin)
    res.setHeader('Access-Control-Allow-Credentials', true)
    return true
  }
  return false
}

function _CHECK_LOGIN(req, res) {
  var checked = CONS.userAccountMap[req.query.name] && CONS.userAccountMap[req.query.name].password === req.query.pswd
  if(checked) {
    var token = sha1(req.query.name + '|' + Math.random())
    RedisCC.client.set(COOKIE_KEY, token)
    res.cookie(COOKIE_KEY, token)
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

  if (!token){
    res.send(_CHECK_LOGIN(req, res))
    return
  }

  RedisCC.client.get(COOKIE_KEY, (err, rep) => {
    if(rep === token){
      res.send(true)
    }else{
      res.send(_CHECK_LOGIN(req, res))
    }
  })
  return
}

function logout(req, res) {
  if (_CHECK_ORIGIN_TRUST(req, res)) {
    RedisCC.client.del(COOKIE_KEY)
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