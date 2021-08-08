var http = require('http');
var fs = require('fs');
var qs = require('querystring');
var mysql = require('mysql');

function createdb(){
return new Promise(function(resolve, reject) {
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: ""
});
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  con.query("CREATE DATABASE IF NOT EXISTS mydb", function (err, result) {
    if (err) throw err;
    console.log("Database created");
  });
});
resolve();
});
}

function createtable(){
  return new Promise(function(resolve, reject) {
  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "mydb"
  });
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    var sql = "CREATE TABLE IF NOT EXISTS time(id int not null auto_increment,activity varchar(255), hours int, minutes int, seconds int, date date NOT NULL DEFAULT current_date, primary key (id))";
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("Table created");
    });
  });
  resolve();
  });
  }

function insertdb(act,hours,mins,secs)
{
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "mydb"
  });

  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    con.query("INSERT INTO time(activity, hours,minutes,seconds) VALUES (?,?,?,?)",[act,hours,mins,secs], function (err, result) {
      if (err) throw err;
      console.log("1 record inserted");
    });
  });
}

function querydb(){

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "mydb"
});

con.connect(function(err) {
  if (err) throw err;
  con.query("SELECT * FROM time", function (err, result, fields) {
    if (err) throw err;
    console.log(result);
  });
});
}

createdb().then(function(){
  return createtable().catch(function(err){console.log(err);})
})  


http.createServer(function (req, res) {
    if(req.url === "/script.js") {
        var file = fs.createReadStream('script.js');
        file.pipe(res);
        res.writeHead(200, {'Content-Type': 'text/javascript'});}
        else if(req.method == "POST")
        {
            console.log("Recieved");
            var body = '';
            req.on('data', function (data) {
            body += data;
            });
            req.on('end', function () {
                var post = qs.parse(body);
                insertdb(post.activity,post.hours,post.minutes,post.seconds);
                querydb();
            }); 
            res.end("received POST request.");
        }
       
        else{
    fs.readFile('index.html', function(err, data) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    return res.end();
  });
}}).listen(8080); 


insertdb("LOL",1,2,2);
querydb();
