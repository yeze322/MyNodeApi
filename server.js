var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json())

var name = 'yeze'
app.get('/name', function(req, res) {
  res.send(name);
});

app.post('/name', function(req, res) {
  console.log(req.body)
  res.send('received!' + req.body.name)
});

app.listen(8080, function () {
  console.log('Example app listening on port 8080!');
});