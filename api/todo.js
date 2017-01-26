var CONS = require('../common/constants')

function _extractUser (req) {
  return req.cookies[CONS.USER_KEY]
}

function _extractPayload (req) {
  return req.body
}

// all todo api need user cookie
// the auth process should execute before request handler
function read (req, res) {
  res.status(204)
  res.send()
}

function write (req, res) {
  res.status(204)
  res.send()
}

function clear (req, res) {
  res.status(204)
  res.send()
}

module.exports = {
  read,
  write,
  clear
}