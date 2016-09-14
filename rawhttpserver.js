//Lets require/import the HTTP module
var http = require('http');
var dispatcher = require('httpdispatcher');

//Lets define a port we want to listen to
const PORT=8080; 

//We need a function which handles requests and send response
function handleRequest(request, response){
    try {
        console.log(request.url);
        dispatcher.dispatch(request, response)
    }catch(err){
        console.log(err)
    }
}

//Create a server
var server = http.createServer(handleRequest);
server.listen(PORT, function(){
    console.log('Server listening on: http://localhost:%s', PORT);
});

dispatcher.setStatic('resources');


var name = 'yeze';
dispatcher.onGet('/name', function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Your name is ' + name);
});

dispatcher.onPost('/name', function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    name = 'sss';
    res.end('Got Post Data');
});

