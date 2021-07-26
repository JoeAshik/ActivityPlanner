var http = require('http');
var fs = require('fs');
http.createServer(function (req, res) {
    if(req.url === "/script.js") {
        var file = fs.createReadStream('script.js');
        file.pipe(res);
        res.writeHead(200, {'Content-Type': 'text/javascript'});}
    else{
    fs.readFile('index.html', function(err, data) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    return res.end();
  });
}}).listen(8080); 