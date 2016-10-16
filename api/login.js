var sha1 = require('sha1')
var CONS = require('../common/constants.js')

const TrustSiteDic = CONS.TrustSiteDic
const COOKIE_KEY = CONS.COOKIE_KEY

var date = new Date()
var getRandomToken = () => sha1(date.getTime())
var lastCookie = getRandomToken()

function _CHECK_COOKIE_EXIST(req) {
  return req.cookies.uatoken === lastCookie
}

function _CHECK_LOGIN(req, res) {
  var checked = CONS.userAccountMap[req.query.name] && CONS.userAccountMap[req.query.name].password === req.query.pswd
  if(checked) {
    lastCookie = sha1(req.query.name + '|' + Math.random())
    res.cookie(COOKIE_KEY, lastCookie)
  }
  return checked
}

function _CHECK_ORIGIN_TRUST(req, res) {
  if (req.headers.origin in TrustSiteDic) {
    // enable AJAX CORS for trust sites
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin)
    res.setHeader('Access-Control-Allow-Credentials', true)
    return true
  }
  return false
}

function login(req, res) {
  if (_CHECK_ORIGIN_TRUST(req, res)) {
    if (_CHECK_COOKIE_EXIST(req)) {
      res.send(true)
    }else{
      var responseObj = _CHECK_LOGIN(req, res)
      res.send(responseObj)
    }
  }else{
    res.status(403)
    res.send(null)
  }
}

function logout(req, res) {
  if (_CHECK_ORIGIN_TRUST(req, res)) {
    lastCookie = null
    //res.cookie(COOKIE_KEY, '')
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