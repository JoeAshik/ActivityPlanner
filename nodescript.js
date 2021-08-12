var http = require('http');
var fs = require('fs');
var qs = require('querystring');
var mysql = require('mysql');


function createdb(){
  return new Promise(function(resolve,reject){
  var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: ""
});
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected for DB Creation");
  con.query("CREATE DATABASE IF NOT EXISTS mydb", function (err, result) {
    if (err) throw err;
    console.log("Database created");
    resolve();
  });
  });
});
}

async function createtable(){
  await createdb();
  return new Promise(function(resolve,reject){
  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "mydb"
  });
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected for table creation");
    var sql = "CREATE TABLE IF NOT EXISTS acttime(id int not null auto_increment,activity varchar(255),hours int,minutes int,seconds int,actdate date default (current_date), primary key (id))";
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("Table Created");
      resolve();
    });
    });
  });
  }

async function insertdb(act,hours,mins,secs)
{
  //await createtable();
  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "mydb"
  });

  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected for updation!");
    con.query("SELECT * FROM acttime WHERE activity= ? AND actdate = curdate();",[act],function(err,result){
      if (err) throw err;
      console.log(result);
      if (result.length == 0){
        console.log("Working");
      con.query("INSERT INTO acttime(activity,hours,minutes,seconds) VALUES(?,?,?,?)",[act,hours,mins,secs],function(err,result){if (err) throw err;});
      }
      else {
        console.log("WTF");
        con.query("UPDATE acttime SET hours =?,minutes=?,seconds=? WHERE activity= ? AND actdate = curdate();",[hours,mins,secs,act],function(err,result){if (err) throw err;});
      }
    });
    });
}

async function querydb(){

  var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "mydb"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected for selection");
  con.query("SELECT * FROM acttime", function (err, result, fields) {
    if (err) throw err;
    console.log(result);
  });
});
}

createtable();

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

//insertdb('LOOL',200,2,4);
//querydb();


