var express = require('express');
var bodyParser = require('body-parser');
var cookieParser  = require('cookie-parser')
var sha1 = require('sha1')

var app = express();
app.use(bodyParser.json())
app.use(cookieParser())

var globalState = {
  'name' : 'yeze322',
  'repo' : 'MyNodeApi',
  'pswd' : '123456'
}

var name = 'yeze322'
var repo = 'MyNodeApi'

var registerKey = (field) => {
  var url = '/' + field
  app.get(url, function(req, res) {
    if(globalState[field] === undefined) {
      res.status(204)
    }
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.send(globalState[field])
  })
  app.post(url, function(req, res) {
    if(req.body[field] === undefined) {
      res.status(404)
      res.send(`Not received ${field}! Error!`)
    }else{
      res.send('received: ' + globalState[field] + '->' + req.body[field])
      globalState[field] = req.body[field]
    }
  })
}

registerKey('name')
registerKey('repo')
registerKey('pswd')

var TrustSiteDic = {
  "http://localhost:3222": true,
  "http://yeze.eastasia.cloudapp.azure.com:3222": true,
  "http://yeze.eastasia.cloudapp.azure.com": true
}

var CHECK_ORIGIN_TRUST = (req, res) => {
  if (req.headers.origin in TrustSiteDic) {
    // enable AJAX CORS for trust sites
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin)
    res.setHeader('Access-Control-Allow-Credentials', true)
    return true
  }
  return false
}

var lastCookie = ''

var CHECK_COOKIE_EXIST = (req) => {
  console.log(req.cookies)
  return req.cookies.uatoken === lastCookie
}

var CHECK_LOGIN = (req, res) => {
  var checked = req.query.name === globalState.name && req.query.pswd === globalState.pswd
  if(checked){
    lastCookie = sha1(req.query.name + '|' + req.query.pswd)
    res.cookie('uatoken', lastCookie)
  }
  return checked
}

app.get('/login', function(req, res) {
  if (CHECK_ORIGIN_TRUST(req, res)) {
    console.log(req.headers.cookie + '|' + lastCookie)
    if (CHECK_COOKIE_EXIST(req)) {
      res.send(true)
    }else{
      var responseObj = CHECK_LOGIN(req, res)
      res.send(responseObj)
    }
  }else{
    res.status(403)
    res.send(null)
  }
})

app.post('/logout', function(req, res) {
  if (CHECK_ORIGIN_TRUST(req, res)) {
    lastCookie = ""
    res.send('cookies clear')
  }else{
    console.log(req.headers.origin)
    res.status(403)
    res.send(null)
  }
})


app.get('/supervisor', function(req, res) {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin)
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.cookie('sptest', sha1(Math.random()))
  res.send(req.headers)
})

app.listen(8080, function () {
  console.log('Example app listening on port 8080!');
});