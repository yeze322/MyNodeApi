var express = require('express');
var bodyParser = require('body-parser');
var cookieParser  = require('cookie-parser')

var app = express();
app.use(bodyParser.json())
app.use(cookieParser())
app.use(require('./common/authUtils').allowCORS)

var LoginApi = require('./api/login.js')
var registerKeyListener = require('./common/registerKeyListener.js')
var EventApi = require('./api/event.js')
var TodoApi = require('./api/todo')

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

app.get('/todo', TodoApi.read)
app.post('/todo', TodoApi.write)
app.delete('/todo', TodoApi.clear)

module.exports = app