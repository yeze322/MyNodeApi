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

app.get('/login', function(req, res) {
  var checked = req.query.name === data.name && req.query.pswd === data.pswd
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.send(checked.toString())
})

app.listen(8080, function () {
  console.log('Example app listening on port 8080!');
});