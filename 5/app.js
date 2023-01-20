const http = require('http');

var handler = function(req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end("Hello world");
};
var www = http.createServer(handler);
www.listen(8081, function(){
    console.log('server is running');
});