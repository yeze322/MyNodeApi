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

function CHECK_ORIGIN_TRUST(req, res) {
  if (req.headers.origin in trustSiteDic) {
    // enable AJAX CORS for trust sites
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin)
    res.setHeader('Access-Control-Allow-Credentials', true)
    return true
  } else if (!_IS_PROD_ENV() && (_IS_FROM_MOCHA_TEST_ENV(req) || _IS_FROM_POSTMAN(req))) {
    return true
  }
  return false
}

module.exports = {
  CHECK_ORIGIN_TRUST
}