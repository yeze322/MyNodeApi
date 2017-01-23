var app = require('./app.js')
var server = app.listen(8080, function () {
  var port = server.address().port
  console.log('Listening on port %s!', port)
})
