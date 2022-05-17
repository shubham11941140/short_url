/**
 * Importing Libraries
 */
 const express = require("express");
 const app = express();
 var mysql = require("mysql");
 const Redis = require('ioredis');
 
 /**
  * Setting up the cache
  */
 var myCacheMap = new Map();
 
 /**
  * Initializing middlewares
  */
 // const server = require("http").Server(app);
 var bodyParser = require("body-parser");
 app.use(bodyParser.json());
 app.use(bodyParser.urlencoded({ extended: true }));
 // app.use(express.static("public"));
 // app.use(express.json());
 
 // Setting up the database
 var con = mysql.createConnection({
     host: "aa10f4pikqa37be.ci44ziqzvjp1.us-east-1.rds.amazonaws.com",
     user: "shubham1194", //DB
     password: "shubhamgupta", //DB
     database: "URL",
 });
 
 con.connect(function (err) {
     if (err) {
         console.log("Error in Databse connection");
         throw err;
     }
     console.log("Connected Databse!");
 });
 
 
 
 //Redis DB
 
 const redis = new Redis({
     host: 'localhost',
     port: 6379
     // password: '<password>'
 });
 redis.on('connect', () => {
     console.log("Redis Connected");
 })
 
 // Read Normal Short URL
 app.post("/api/readshorten/:apiKey", async function (req, res) {
     // create user in req.body
 
     let apiKey = req.params.apiKey;
     if (apiKey != 'CSD1234') {
         res.send('Please provide Dev API Key');
         return;
     }
 
 
     /**
      * Searching the Email for the corresponding API key
      */
     // let sqlapi = `SELECT email from emailAPIKeys where apikey = "${apiKey}" ; `;
     // let dataapi = " ";
     // con.query(sqlapi, dataapi, (err, result) => {
 
     //     if (err)
     //     {
     //         console.log("Something Went Wrong... Try Again...");
     //         res.send("Please Try again");
     //     }
     //     else if (result.length == 0)
     //     {
     //         console.log("API Key Invalid");
     //         res.send("API key not valid");
     //     }
     //     else
     //     {
     //         Email = result[0].email;
 
     link = req.body.shorturl;
     let data = " ";
     // res.send(link);
     // return;
     if (link == undefined) {
         res.send("Can't Read URL");
         return;
     }
 
     redis.get(link, (err, reply) => {
         if (err) {
             console.log(err);
         }
         if (reply != null) {
             res.json({ longURL: reply });
             console.log("Hit from cache");
 
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
         else {
             {
                 
 
                 //     //**********************************To Update this LINk************************* /
 
 
                 //Using Cache
                 // if (myCacheMap.has(link)) {
                 //     // console.log();
                 //     // res.redirect(myCacheMap.get(link));
 
                 // }
                 // else {
                 //Db query for link of shorturl
                 let sql = `SELECT url,ttl,creation_timestamp from urlMap where shortenedurl = "${link}" ; `;
                 con.query(sql, data, (err, result) => {
 
                     if (err) {
                         res.send("Something Went Wrong... Try Again...");
                         return;
                     }
 
                     if (result.length == 0) {
                         res.send("No URL for this ShortURL exits");
                         return;
                     }
                     else {
                         res.json({ longURL: result[0].url });
                         // halfMyCacheMap();
                         // myCacheMap.set(link, result[0].url);
                         redis.set(link, result[0].url);
                         //Update redirection count
                         let sqlupdate = `UPDATE urlMap SET num_of_redirections = num_of_redirections + 1 where  shortenedurl = "${link}";`;
                         let query = con.query(sqlupdate, data, (err, result) => {
                             if (err) {
                                 //   console.log("Increment failed in redirection counts");
                                 return;
                             }
                         });
                     }
                 });
                 // }
             }
         }
     });
     //     }
     // });
 });
 
 //UTILITY FUNCtion
 
 app.listen(7000, (e) => {
     console.log(`listening on cloud API port 7000`);
 });
 
 /**
  * Function to generate the random string of 11 characters from a set of preselected 62 characters
  */
 function makeid(/*length = 5*/) {
     var result = "";
     var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
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
 
 