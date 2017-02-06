var express = require('express');
var bodyParser = require('body-parser');
var cookieParser  = require('cookie-parser')
var authUtils = require('./common/authUtils')

var app = express();
app.use(bodyParser.json())
app.use(cookieParser())
app.use(authUtils.allowCORS)

var LoginApi = require('./api/login.js')
var registerKeyListener = require('./common/registerKeyListener.js')
var EventApi = require('./api/event.js')
var UserDataStorageApi = require('./api/userData')

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

app.get('/user/:key', authUtils.cookieChecker, UserDataStorageApi.read)
app.post('/user/:key', authUtils.cookieChecker, UserDataStorageApi.write)
app.delete('/user/:key', authUtils.cookieChecker, UserDataStorageApi.delete)

app.get('/test/auth', authUtils.cookieChecker, (req, res) => {
  res.status(200)
  res.send()
})

module.exports = app