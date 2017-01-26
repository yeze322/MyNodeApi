var trustSiteDic = require('../common/constants.js').TrustSiteDic

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

function _CHECK_ORIGIN_TRUST(req) {
  if (req.headers.origin in trustSiteDic) {
    return true
  } else if (!_IS_PROD_ENV() && (_IS_FROM_MOCHA_TEST_ENV(req) || _IS_FROM_POSTMAN(req))) {
    return true
  }
  return false
}

function allowCORS (req, res, next) {
  if (_CHECK_ORIGIN_TRUST(req)) {
    res.header('Access-Control-Allow-Origin', req.headers.origin)
    res.header('Access-Control-Allow-Credentials', true)
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  }
  next()
}

module.exports = {
  allowCORS
}