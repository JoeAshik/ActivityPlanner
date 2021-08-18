var http = require('http');
var fs = require('fs');
var qs = require('querystring');
var mysql = require('mysql');



function createdb(){
  let myPromise = new Promise(function(resolve,reject){
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

function returnhtml(res)
{
  fs.readFile('index.html', function(err, data) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    return res.end();
  });
}

async function postmethod(req,res)
{
  console.log("POST Request Recieved");
  var body = '';
  req.on('data', function (data) {
  body += data;
  });
  req.on('end',async function () {
      var post = qs.parse(body);
      let lol = await insertquery(con,post.activity,post.hours,post.minutes,post.seconds);
      //insertdb(post.activity,post.hours,post.minutes,post.seconds);
  }); 
}

async function getmethod(res)
{
  console.log("GET Request Receieved");
        let initialresult = await displayquery(con);
        //console.log(initialresult);
        let converted = convertdata(initialresult);
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.write(JSON.stringify(converted));
        res.end();
}


http.createServer(async function (req, res) {
  if(req.url === "/script.js") {
      var file = fs.createReadStream('script.js');
      file.pipe(res);
      res.writeHead(200, {'Content-Type': 'text/javascript'});}
  
      else if(req.method == "POST")
      {
          postmethod(req,res);
      }
       
      else if(req.url == "/posts")
      {
        getmethod(res);  
      }
      
      else{
        returnhtml(res);
      
}}).listen(8080); 

//insertdb('LOOL',200,2,4);
//querydb();



function convertdata(result) 
{

let len = result.length;
const actdata  = {};
actdata.data = [];
for(i=0;i<len;i++)
{
  actdata.data[i]=result[i];
}
return actdata;
}


var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "mydb"
});

async function queryfunction(con,sql,values)
{
let myPromise = new Promise(function(resolve,reject){
  con.query(sql,values, function (err, result) {
    if (err) throw err;
    resolve(result);
  })
});
let value = await myPromise;
return (value);
}

//queryfunction(con,"SELECT * FROM acttime WHERE activity = ?",["ARAARA"]).then(function(){});

async function displayquery(con)
{
  let query = "SELECT * FROM acttime WHERE actdate = curdate();"
  let result = await queryfunction(con,query)
  return result;
}

async function createquery(con)
{
  await createdb();
  let query = "CREATE TABLE IF NOT EXISTS acttime(id int not null auto_increment,activity varchar(255),hours int,minutes int,seconds int,actdate date default (current_date), primary key (id))";
  let result = await queryfunction(con,query)
  return;
}

async function insertquery(con,act,hours,mins,secs)
{

  let query1 = "SELECT * FROM acttime WHERE activity= ? AND actdate = curdate();"
  let query2 = "INSERT INTO acttime(activity,hours,minutes,seconds) VALUES(?,?,?,?)"
  let query3 = "UPDATE acttime SET hours =?,minutes=?,seconds=? WHERE activity= ? AND actdate = curdate();"
  values2 = [act,hours,mins,secs];
  values3 = [hours,mins,secs,act];

  let result = await queryfunction(con,query1,[act]);
  if (result.length == 0)
  {
    let final = await queryfunction(con,query2,values2);
    return;
  }

  else
  {
    let final = await queryfunction(con,query3,values3);
    return;
  }
}

