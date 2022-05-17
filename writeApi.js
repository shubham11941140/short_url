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
 
 //Create Short URL
 
 
 
 app.post("/api/createshorten/:apiKey", async function (req, res) {
     // redis.set('myNAme007','bond');
     // redis.get("dhruvHarsh", (err,res1)=>{
     //     if(err)
     //         console.log(err);
     //     else if(res1!==null)
     //         console.log(res1);
     //     else
     //         console.log('null returned from redis');
     //     res.send("From redis");
     // });
 
 
     let apiKey = req.params.apiKey;
     if (apiKey != 'CSD1234') {
         res.send('Please provide Dev API Key');
         return;
     }
     /**
      * SQL query to check the API key for the particular Email
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
     // Email = result[0].email;
     let sql = "INSERT Into urlMap Set ?";
     let url1 = makeid();
     let longurl = req.body.urldata;
     if (longurl == undefined) {
         res.send("Provide URL" + longurl);
         return;
     }
     let timestamp = new Date();
     let data = {
         // email: Email,
         url: longurl,
         shortenedurl: url1,
         creation_timestamp: timestamp,
     };
 
     /**
      * SQL query to insert the data into DB
      */
     let query = con.query(sql, data, (err, result) => {
         if (err) {
             res.send("Something Went Wrong... Try Again...");
             // console.log(err);
             return;
         }
         //   res.render("shortURLResponse", { shorturl: url1 });
 
         /** Send back the response of short URL */
         res.json({ shorturl: url1 });
     });
     //     }
     // });
 });
 
 
 // Create Custom Short URL
 app.post("/api/createcustomshorten/:apiKey", async function (req, res) {
     // create user in req.body
 
     let apiKey = req.params.apiKey;
     if (apiKey != 'CSD1234') {
         res.send('Please provide Dev API Key');
         return;
     }
     /**
      * SQL query to check the API key for the particular Email
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
     // Email = result[0].email;
 
     let Url = req.body.longurldata;
     let customurl = req.body.customurldata;
     let TTL = req.body.ttl;
     // console.log("Now",req.body.email);
     // console.log("OK",Url,customurl,TTL);
     let timestamp = new Date();
 
     /**
      * Checking for the undefined values
      */
     if (
         Url == "undefined" ||
         Url == "" ||
         customurl == "undefined" ||
         customurl == ""
     ) {
         res.send("No urldata given");
         return;
     }
 
     if (
         TTL == undefined ||
         TTL > 120 ||
         TTL == ""
     ) {
         TTL = 60;
         // console.log("Yeah");
         // return;
     }
 
     /**
      * SQL query to insert the data into the URL table
      */
     let sqlinsert = "INSERT Into urlMap Set ?";
     let datainsert = {
         url: Url,
         shortenedurl: customurl,
         ttl: TTL,
         creation_timestamp: timestamp,
         num_of_redirections: 0,
         // email: Email,
     };
 
     /**
      * SQL query to search the data corresponding the given short url
      */
     let sqlsearch = `SELECT * from urlMap where  shortenedurl = "${customurl}" ;`;
     let datasearch = " ";
     con.query(sqlsearch, datasearch, (err, result) => {
         if (err) {
             res.send("Something Went Wrong... Try Again...");
             console.log(err);
             return;
         }
 
         /**
          * If the given custom url is not present in the DB
          */
         if (result.length == 0) {
             let query = con.query(sqlinsert, datainsert, (err, result) => {
                 if (err) {
                     res.send("Something Went Wrong... Try Again...");
                     console.log(err);
                     return;
                 }
                 data = " ";
                 //   res.render("premiumShortURLResponse", { shorturl: customurl });
                 res.json({ shorturl: customurl });
             });
         }
         else {
             res.send(`Try with other URL, This short Url already exits`);
         }
     });
     //     }
     // });
 });
 
 //Delete URL
 app.post("/api/deleteurl/:apiKey", async function (req, res) {
     // create user in req.body
 
     let apiKey = req.params.apiKey;
     if (apiKey != 'CSD1234') {
         res.send('Please provide Dev API Key');
         return;
     }
 
     /**
      * Search for the Email for the corresponding API key
      */
     let sqlapi = `SELECT email from emailAPIKeys where apikey = "${apiKey}" ; `;
     let dataapi = " ";
     con.query(sqlapi, dataapi, (err, result) => {
 
         if (err) {
             console.log("Something Went Wrong... Try Again...");
             res.send("Please Try again");
         }
         else if (result.length == 0) {
             console.log("API Key Invalid");
             res.send("API key not valid");
         }
         else {
             Email = result[0].email;
             let data = " ";
 
             //**********************************To Upadate this LINk************************* /
             link = req.body.shorturl;
             if (link == undefined) {
                 res.send("Can't Read URL");
                 return;
             }
             else {
                 //check user has right over URl
 
                 let sql = `SELECT email,url,ttl,creation_timestamp from urlMap where shortenedurl = "${link}" ; `;
                 con.query(sql, data, (err, result) => {
 
                     if (err) {
                         res.send("Something Went Wrong... Try Again...");
                         return;
                     }
 
                     if (result.length == 0) {
                         res.send("No URL for this ShortURL exits");
                         return;
                     }
                     // res.json({longURL:result[0].url});
                     // halfMyCacheMap();
                     // myCacheMap.set(link,result[0].url);
 
                     /**
                      * If the current user Email is equal to the Email from which the short url was created
                      * then user can delete the short url
                      */
                     if (result[0].email == Email) {
                         let sqldel = `DELETE from urlMap  where  shortenedurl = "${link}";`;
                         let query = con.query(sqldel, data, (err, result) => {
                             if (err) {
                                 //   console.log("Increment failed in redirection counts");
                                 return;
                             }
 
                             res.send("Delete Successful");
                             redis.del(link);
                         });
                     }
                     else {
                         // res.send("Not enough permission");
                         // return;
 
                         let sqldel = `DELETE from urlMap  where  shortenedurl = "${link}";`;
                         let query = con.query(sqldel, data, (err, result) => {
                             if (err) {
                                 //   console.log("Increment failed in redirection counts");
                                 return;
                             }
 
                             res.send("Delete Successful");
                             redis.del(link);
                         });
                     }
                 });
 
                 //Using Cache
                 // if (myCacheMap.has(link))
                 // {
                 //     myCacheMap.delete(link);
                 // }
 
             }
         }
     });
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
 