var express = require('express');
var bodyParser = require('body-parser');
var cookieParser  = require('cookie-parser')
var cors = require('cors')

var app = express();
app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors())

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