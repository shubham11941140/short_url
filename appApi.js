const express = require("express");
const app = express();
var mysql = require("mysql");



var myCacheMap=new Map();

// const server = require("http").Server(app);
var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static("public"));
// app.use(express.json());


// Databases
var con = mysql.createConnection({
  host: "database-2.cqztcdymd18c.us-east-1.rds.amazonaws.com",
  user: "admin", //DB
  password: "shubhamgupta1", //DB
  database: "URL",
});
con.connect(function (err) {
  if (err) {
    console.log('Error in Databse connection');
    throw err;
  }
  console.log("Connected Databse!");
});


//Create Short URL

app.post('/api/createshorten/:apiKey', function (req, res) {
    // create user in req.body
    let Email=validateAPIkey(req.params.apiKey);
    if(Email=="F"){
        res.send("API key Invalid");
        return;
    }
    // console.log(req.body);
    // res.send("OK Test");
    // return;
    let sql = "INSERT Into urlMap Set ?";
    let url1 = makeid();
    let longurl=req.body.urldata;
    let timestamp = new Date();
    let data = {
        email:Email,
      url:longurl ,
      shortenedurl: url1,
      creation_timestamp: timestamp
    };
        let query = con.query(sql, data, (err, result) => {
          if (err) {
            res.send("Something Went Wrong... Try Again...")
            // console.log(err);
            return ;
          }
        //   res.render("shortURLResponse", { shorturl: url1 });
            res.json({shorturl: url1});
        });
});
// Create Custom Short URL
app.post('/api/createcustomshorten/:apiKey', function (req, res) {
    // create user in req.body
    let Email=validateAPIkey(req.params.apiKey);
    if(Email=="F"){
        res.send("API key Invalid");
        return;
    }
    // 


  let Url = req.body.longurldata;
  let customurl = req.body.customurldata;
  let TTL = req.body.ttl;
  // console.log("Now",req.body.email);
  // console.log("OK",Url,customurl,TTL);
  let timestamp = new Date();
  if(Url=='undefined'||Url==''||customurl=='undefined'||customurl==''){
    res.send("No urldata given");
    return;
  }
  if(TTL==undefined||TTL>120||TTL==''){
    TTL=60;
    // console.log("Yeah");
    // return;
  }
  let sqlinsert = "INSERT Into urlMap Set ?";
  let datainsert = {
    url: Url,
    shortenedurl: customurl,
    ttl: TTL,
    creation_timestamp: timestamp,
    num_of_redirections: 0,
    email: Email
  };


  
  let sqlsearch = `SELECT * from urlMap where  shortenedurl = "${customurl}" ;`;
  let datasearch = " ";
  con.query(sqlsearch, datasearch, (err, result) => {
    if (err) {
      res.send("Something Went Wrong... Try Again...")
      console.log(err);
      return ;
    }
    if (result.length == 0) {
      let query = con.query(sqlinsert, datainsert, (err, result) => {
        if (err) {
          res.send("Something Went Wrong... Try Again...")
          console.log(err);
          return ;
        }
        data=" ";
        //   res.render("premiumShortURLResponse", { shorturl: customurl });
        res.json({shorturl: customurl});
      });
    } else {
      res.send(`Try with other URL, This short Url already exits`);
    }
  });
});

// Read Normal Short URL
app.post('/api/readshorten/:apiKey', function (req, res) {
    // create user in req.body
    if(validateAPIkey(req.params.apiKey)=="F"){
        res.send("API key Invalid");
        return;
    }
    // console.log(req.params.shorturl);
    let data = " ";


    //**********************************To Upadate this LINk************************* /
    link = req.body.shorturl;
    if(link==undefined){
      res.send("Can't Read URL");
      return;
    }
    
    //Using Cache
    if(myCacheMap.has(link)){
      // console.log();
      res.redirect(myCacheMap.get(link));
      // console.log("Hit from cache");
      //Update redirection count
      let sqlupdate = `UPDATE urlMap SET num_of_redirections = num_of_redirections + 1 where  shortenedurl = "${link}";`;
      let query = con.query(sqlupdate, data, (err, result) => {
        if (err) {
          console.log("Increment failed in redirection counts");
          // throw err;
          return;
        }
      });
      return;
    }
    //Db query for link of shorturl
    let sql = `SELECT url,ttl,creation_timestamp from urlMap where shortenedurl = "${link}" ; `;
    con.query(sql, data, (err, result) => {
      if (err) {
        res.send("Something Went Wrong... Try Again...")
        return ;
      }
      if(result.length==0){
        res.send("No URL for this ShortURL exits");
        return;
      }
        res.json({longURL:result[0].url});
      halfMyCacheMap();
      myCacheMap.set(link,result[0].url);
      let sqlupdate = `UPDATE urlMap SET num_of_redirections = num_of_redirections + 1 where  shortenedurl = "${link}";`;
      let query = con.query(sqlupdate, data, (err, result) => {
        if (err) {
        //   console.log("Increment failed in redirection counts");
          return;
        }
      });
    });
});

//Delete URL
app.post('/api/deleteurl/:apiKey', function (req, res) {
  // create user in req.body
  let Email=validateAPIkey(req.params.apiKey);
    if(Email=="F"){
        res.send("API key Invalid");
        return;
    }
  // console.log(req.params.shorturl);
  let data = " ";

  //**********************************To Upadate this LINk************************* /
  link = req.body.shorturl;
  if(link==undefined){
    res.send("Can't Read URL");
    return;
  }
  //check user has right over URl
  
  
    let sql = `SELECT email,url,ttl,creation_timestamp from urlMap where shortenedurl = "${link}" ; `;
    con.query(sql, data, (err, result) => {
    if (err) {
      res.send("Something Went Wrong... Try Again...")
      return ;
    }
    if(result.length==0){
      res.send("No URL for this ShortURL exits");
      return;
    }
    // res.json({longURL:result[0].url});
    // halfMyCacheMap();
    // myCacheMap.set(link,result[0].url);
    if(result[0].email==Email){
      let sqldel = `DELETE from urlMap  where  shortenedurl = "${link}";`;
    let query = con.query(sqldel, data, (err, result) => {
      if (err) {
      //   console.log("Increment failed in redirection counts");
        return;
      }
      res.send("Delete Successful");
    });
    }
    else{
      res.send("Not enough permission");
      return;
    }
    
  });
  //Using Cache
  if(myCacheMap.has(link)){
    myCacheMap.delete(link);
  }
});

// //Give Link of short URL

/*
var express = require('express')
var bodyParser = require('body-parser')
 
var app = express()
 
const server = require("http").Server(app);
// create application/json parser
var jsonParser = bodyParser.json()
 
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })
 
// POST /login gets urlencoded bodies
app.post('/login', urlencodedParser, function (req, res) {
    // console.log("Hello");
    // console.log("Helli",res.send('welcome,1 '));
    const obj = JSON.parse(JSON.stringify(req.body)); // req.body = [Object: null prototype] { title: 'product' }
    // temp=typeof(obj)
    console.log(obj); // { title: 'product' }
    // res.send('welcome,1 ')
    // sleep(1);
    // console.log(req.body.username,rollno);
    res.json({a:1});
});
 
// POST /api/users gets JSON bodies
app.post('/api/users', jsonParser, function (req, res) {
  // create user in req.body
});

app.post('/api/:apiKey', jsonParser, function (req, res) {
    // create user in req.body
  });

// app.post('/test/:name/:rollnum=11',(req,res)=>{
//     console.log(req.);
//     res.send("Ok");
// });
*/
//UTILITY FUNCtion

app.listen(3000, (e) => {
    console.log(`listening on  API port 3000`);
  });
  
  function makeid(/*length = 5*/) {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    result =
      characters.charAt(Math.floor(Math.random() * charactersLength)) +
      characters.charAt(Math.floor(Math.random() * charactersLength)) +
      characters.charAt(Math.floor(Math.random() * charactersLength)) +
      characters.charAt(Math.floor(Math.random() * charactersLength)) +
      characters.charAt(Math.floor(Math.random() * charactersLength)) +
      characters.charAt(Math.floor(Math.random() * charactersLength));
    return result;
  }


function validateAPIkey(apiKey){
    let sql = `SELECT * from urlMap where shortenedurl = "${apiKey}" ; `;
    let data=" ";
    let query = con.query(sql, data, (err, result) => {
        if (err) {
          console.log("Something Went Wrong... Try Again...");
          return "F";
        }
        if(result.length==0){
          console.log("API Key Invalid");
          return "F";
        }
        return result[0].email;
    });
}


function halfMyCacheMap(){
  if(myCacheMap.size>3000000){
    let cnt=0;
    //Can also Implement it
    myCacheMap.clear();
  //   for (const [key, value] of myCacheMap.entries()) {
  //       myMap.delete(key);
  //       cnt++;
  //       if(cnt>=1500000)
  //         break;
  //   }
  }
}
