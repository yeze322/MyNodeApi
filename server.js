var express = require('express');
var bodyParser = require('body-parser');
var cookieParser  = require('cookie-parser')

var app = express();
app.use(bodyParser.json())
app.use(cookieParser())

var LoginApi = require('./api/login.js')
var registerKey = require('./common/registerKey.js')

registerKey(app, 'name')
registerKey(app, 'repo')
registerKey(app, 'pswd')

app.get('/login', LoginApi.login)
app.post('/logout', LoginApi.logout)
app.get('/supervisor', LoginApi.supervisor)

app.listen(8080, function () {
  console.log('Example app listening on port 8080!');
});