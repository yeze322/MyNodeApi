var express = require('express');
var bodyParser = require('body-parser');
var cookieParser  = require('cookie-parser')

var whiteList = require('./common/constants').TrustSiteDic
function allowCORS (req, res, next) {
  if (req.headers.origin in whiteList) {
    res.header('ccess-Control-Allow-Origin', req.headers.origin)
    res.header('Access-Control-Allow-Credentials', true)
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next()
  }
}
var app = express();
app.use(bodyParser.json())
app.use(cookieParser())
app.use(allowCORS)

var LoginApi = require('./api/login.js')
var registerKeyListener = require('./common/registerKeyListener.js')
var EventApi = require('./api/event.js')

registerKeyListener(app, 'name')
registerKeyListener(app, 'repo')
registerKeyListener(app, 'pswd')

//TODO: login should be post method!
app.post('/login', LoginApi.login)
app.post('/logout', LoginApi.logout)
app.get('/supervisor', LoginApi.supervisor)
app.post('/eventon/:eventName', EventApi.onOpenEvent)
app.post('/eventoff/:eventName', EventApi.onCloseEvent)
app.get('/event/:eventName', EventApi.getEventStatus)

module.exports = app