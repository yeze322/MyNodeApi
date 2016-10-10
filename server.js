var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json())

var data = {
  'name' : 'yeze322',
  'repo' : 'MyNodeApi',
  'pswd' : '123456'
}

var name = 'yeze322'
var repo = 'MyNodeApi'

var registerKey = (field) => {
  var url = '/' + field
  app.get(url, function(req, res) {
    if(data[field] === undefined) {
      res.status(204)
    }
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.send(data[field])
  })
  app.post(url, function(req, res) {
    if(req.body[field] === undefined) {
      res.status(404)
      res.send(`Not received ${field}! Error!`)
    }else{
      res.send('received: ' + data[field] + '->' + req.body[field])
      data[field] = req.body[field]
    }
  })
}

registerKey('name')
registerKey('repo')
registerKey('pswd')

var lastCookie = ''

var TrustSiteDic = {
  "http://localhost:3222": true,
  "http://yeze.eastasia.cloudapp.azure.com:3222": true
}

var AJAX_CORS_CHECK = (req, res) => {
  if (req.headers.origin in TrustSiteDic) {
    // enable AJAX CORS for trust sites
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin)
    res.setHeader('Access-Control-Allow-Credentials', true)
    return true
  }
  return false
}

app.get('/login', function(req, res) {
  if (AJAX_CORS_CHECK(req, res)) {
    console.log(req.headers.cookie + '|' + lastCookie)
    // check cookies
    if (req.headers.cookie === lastCookie) {
      res.send(true)
    }else{
      var checked = req.query.name === data.name && req.query.pswd === data.pswd
      if(checked){
        lastCookie = req.headers.cookie
      }
      res.send(checked)
    }
  }else{
    res.status(403)
    res.send(null)
  }
})

app.post('/logout', function(req, res) {
  if (AJAX_CORS_CHECK(req, res)) {
    lastCookie = ""
    res.send('cookies clear')
  }else{
    console.log(req.headers.origin)
    res.status(403)
    res.send(null)
  }
})


app.get('/supervisor', function(req, res) {
  res.send(req.headers)
})

app.listen(8080, function () {
  console.log('Example app listening on port 8080!');
});