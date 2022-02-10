const express = require("express");
const app = express();
const ejs = require("ejs");
var mysql = require("mysql");
var nodemailer = require("nodemailer");

// var exec = require('child_process').exec,
//     child;

// child = exec('node appApi.js {{args}}',
//   function (error, stdout, stderr) {
//     console.log('stdout: ' + stdout);
//     console.log('stderr: ' + stderr);
//     if (error !== null) {
//       console.log('exec error: ' + error);
//     }
// });

function helperForSendOTP(emaildb, otpdb) {
  console.log("OTP:", otpdb);
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "kingtemp204000@gmail.com", //EMAIL
      pass: "ShubhamGupta", //Password
    },
  });

  var mailOptions = {
    from: "kingtemp204000@gmail.com", //Your Email
    to: emaildb,
    subject: "OTP for URL shortener",
    text: `Your OTP for URL shortener is ${otpdb}. It will expire in 5 minutes.`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

const server = require("http").Server(app);
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
// app.use(express.json());

var port = process.env.PORT || 8080; // set the port of our application
// app.listen(port)

console.log("Listening at the right port");
// app.set('port', process.env.port || 8080 || 3000 || 5000);

app.set("view engine", "ejs");
// Databases
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

//Just random Things Done To generate Graph
const tableData = [
  {
    url: "https://www.google.com",
    shortenedurl: "okgoogly123",
    creation_timestamp: "12-Jan-2022",
    num_of_redirections: 0,
  },
  {
    url: "https://www.google.com",
    shortenedurl: "okgoogly123",
    creation_timestamp: "12-Jan-2022",
    num_of_redirections: 0,
  },
  {
    url: "https://www.google.com",
    shortenedurl: "okgoogly123",
    creation_timestamp: "12-Jan-2022",
    num_of_redirections: 0,
  },
  {
    url: "https://www.google.com",
    shortenedurl: "okgoogly123",
    creation_timestamp: "12-Jan-2022",
    num_of_redirections: 0,
  },
  {
    url: "https://www.google.com",
    shortenedurl: "okgoogly123",
    creation_timestamp: "12-Jan-2022",
    num_of_redirections: 0,
  },
  {
    url: "https://www.google.com",
    shortenedurl: "okgoogly123",
    creation_timestamp: "12-Jan-2022",
    num_of_redirections: 0,
  },
];
const graphData = [];
for (let i = 0; i < 15; i++) {
  graphData.push({
    curr_date: `${i + 1}-Jan-2022`,
    readcount: Math.random() * 60,
    writecount: Math.random() * 60,
  });
}

/***************************GET *******************/
app.get("/", (req, res) => {
  console.log();
  res.redirect("/home");
});

app.get("/home", (req, res) => {
  res.render("homepage", {
    shorturl: "tfuykfc",
    email: "yoyo@iitbhilai.ac.in",
    data: JSON.stringify(tableData),
    graphData: JSON.stringify(graphData),
  });
});

app.get("/:shorturl", (req, res) => {
  // console.log(req.params.shorturl);
  console.log(":params received");

  // res.send("Have to redirect");
  // return;
  link = req.params.shorturl;
  if (link == undefined) {
    res.send("Can't Read URL");
    return;
  }
  let data = " ";
  let sql = `SELECT url from urlMap where shortenedurl = "${link}" ; `;
  // console.log(sql);
  let query = con.query(sql, data, (err, result) => {
    if (err) {
      res.send("Something Went Wrong... Try Again...");
      console.log(err);
      // throw err;
      return;
    }
    if (result.length == 0) {
      res.send("No URL for this ShortURL exits");
      return;
    }
    console.log(result[0].url);
    // res.send("Done");
    res.redirect(result[0].url);
    let sqlupdate = `UPDATE urlMap SET num_of_redirections = num_of_redirections + 1 where  shortenedurl = "${link}";`;
    let query = con.query(sqlupdate, data, (err, result) => {
      if (err) {
        console.log("Increment failed in redirection counts");
        // throw err;
        return;
      }
    });
  });
});

/**************************POST *****************8*/
app.post("/nonpremiumurl", async (req, res) => {
  // console.log(req.body.urldata);
  let sql = "INSERT Into urlMap Set ?";
  let flag = true;

  let timestamp = new Date();
  let url1 = makeid();
  let data = {
    url: req.body.urldata,
    shortenedurl: url1,
    creation_timestamp: timestamp,
  };

  let sqlsearch = `SELECT * from urlMap where  shortenedurl = "${url1}" ;`;
  let querysearch = con.query(sqlsearch, data, (err, result) => {
    if (err) {
      res.send("Something Went Wrong... Try Again...");
      console.log(err);
      // throw err;
      return;
    }
    if (result.length == 0) {
      let query = con.query(sql, data, (err, result) => {
        if (err) {
          res.send("Something Went Wrong... Try Again...");
          console.log(err);
          // throw err;
          return;
        }
        flag = false;
        // res.send(`Our1 shorthened Url is: s.u/${url1}` );
        res.render("shortURLResponse", { shorturl: url1 });
      });
    } else {
      let url1 = makeid();
      let data = { url: req.body.urldata, shortenedurl: url1 };
      let sqlsearch = `SELECT * from urlMap where  shortenedurl = "${url1}" ;`;
      let query = con.query(sql, data, (err, result) => {
        if (err) {
          res.send("Something Went Wrong... Try Again...");
          console.log(err);
          // throw err;
          return;
        }
        // console.log(result);
        flag = false;
        // res.render('index3.html',{url1});
        res.send(`Our shorthened Url is: s.u/${url1}`);
      });
    }
  });
});

app.post("/nonpremiumOTPcreate", (req, res) => {
  Email = req.body.jsonemail;
  // console.log(Email);
  res.send("Ok Sending to JS fetch");
  //Create OTP
  let Otp = Math.floor(Math.random() * 100000);
  let Time = new Date();
  //Store OTP and store in DB

  //Query DB if OTP exists for email
  // if expired overwrite it
  // if not expired then do nothing
  let sql = "INSERT Into emailOTP Set ?";
  let data = { email: Email, otp: Otp, time: Time };
  let sqlsearch = `SELECT * from emailOTP where  email = "${Email}" ;`;
  {
    let querysearch = con.query(sqlsearch, data, (err, result) => {
      if (err) {
        // res.send("Something Went Wrong... Try Again...")
        console.log(err);
        // throw err;
        return;
      }
      // console.log(result,result.length);
      if (result.length > 0) {
        let sqldelete = `DELETE from emailOTP where  email = "${Email}" ;`;
        let querydelete = con.query(sqldelete, data, (err, result) => {
          if (err) {
            // res.send("Something Went Wrong... Try Again...")
            console.log(err);
            // throw err;
            return;
          }
          // console.log(result);
        });
      }
      let query = con.query(sql, data, (err, result) => {
        if (err) {
          // res.send("Something Went Wrong... Try Again...")
          console.log(err);
          // throw err;
          return;
        }
        //SEND OTP to user
        //via mailto function
        //Third party API for mail sending
        // email, otp
        console.log("Calling Helper to send OTP to mail");
        helperForSendOTP(Email, Otp);
      });
    });
  }
});

app.post("/nonpremiumOTPverify", (req, res) => {
  console.log("Receiveing OTP", req.body.otp, req.body.email);

  Email = req.body.email;
  console.log(269, Email);

  let Time = new Date();
  let OTPgiven = req.body.otp;
  //Store OTP and store in DB
  let data = " ";
  if (Email == "" || OTPgiven == "") {
    res.send("No Email/OTP Found");
    return;
  }
  //Query DB if OTP exists for email
  // if expired overwrite it
  // if not expired then do nothing

  // let sqlforGraph = `select url, shortenedurl, creation_timestamp, num_of_redirections
  //       from urlMap
  //       where email = "${Email}"
  //       order by creation_timestamp DESC
  //       limit 15;`;

  let sqlforGraph = `select url, shortenedurl, creation_timestamp, num_of_redirections
        from urlMap
        where email = "${Email}"
        order by creation_timestamp DESC
        limit 15;`;

  let sqlsearch = `SELECT * from emailOTP where  email = "${Email}" ;`;
  {
    let querysearch = con.query(sqlsearch, data, (err, result) => {
      if (err) {
        res.send("Something Went Wrong... Try Again...");
        console.log(err);
        // throw err;
        return;
      }
      // console.log(result,result.length);
      if (result.length > 0) {
        let timetaken = Time - result[0].time;
        timetaken /= 1000;
        // console.log(timetaken);
        if (result[0].otp == OTPgiven) {
          //Time verified
          if (timetaken <= 300) {
            // res.send('Found OTP correct...');
            con.query(sqlforGraph, data, (err, result) => {
              if (err) {
                res.send("Something Went Wrong... Try Again...");
                console.log(err);
                // throw err;
                return;
              }
              // console.log("result", result);
              result = result.map((v) => Object.assign({}, v));
              res.render("premiumForm", {
                email: Email,
                data: JSON.stringify(result),
              }); // dataGraph: result
              // console.log("Data", data);
            });
          }
          // res.sendFile(__dirname+'/public/premiumSecondPage/index2.html');
          else res.send("OTP expired");
        } else res.send("OTP sent wrong");
        // res.sendFile(__dirname+'/public/premiumSecondPage/index2.html');
      } else {
        res.send("No OTP found");
      }
    });
  }
});

app.post("/test", (req, res) => {
  // console.log(req.body);
  res.send("Testing Route..");
});

app.post("/customurl", (req, res) => {
  let Url = req.body.urldata;
  let customurl = req.body.customurldata;
  let TTL = req.body.TTL;
  // console.log("Now",req.body.email);
  // console.log("OK",Url,customurl,TTL);
  let timestamp = new Date();
  if (
    Url == "undefined" ||
    Url == "" ||
    customurl == "undefined" ||
    customurl == ""
  ) {
    res.send("No urldata given");
    return;
  }
  if (TTL == undefined || TTL > 120 || TTL == "") {
    TTL = 60;
    // console.log("Yeah");
    // return;
  }
  // res.send("Sorry123");
  // return;
  let sqlforGraph = `select url, shortenedurl, creation_timestamp, num_of_redirections
        from urlMap
        where email = "${Email}"
        order by creation_timestamp DESC
        limit 15;`;

  console.log("query : ", sqlforGraph);

  let sqlinsert = "INSERT Into urlMap Set ?";
  let datainsert = {
    url: Url,
    shortenedurl: customurl,
    ttl: TTL,
    creation_timestamp: timestamp,
    num_of_redirections: 0,
    email: req.body.email,
  };

  let sqlsearch = `SELECT * from urlMap where  shortenedurl = "${customurl}" ;`;
  let datasearch = " ";
  let querysearch = con.query(sqlsearch, datainsert, (err, result) => {
    if (err) {
      res.send("Something Went Wrong... Try Again...");
      console.log(err);
      // throw err;
      return;
    }
    if (result.length == 0) {
      let query = con.query(sqlinsert, datainsert, (err, result) => {
        if (err) {
          res.send("Something Went Wrong... Try Again...");
          console.log(err);
          // throw err;
          return;
        }
        // console.log(result);
        // res.sendFile(__dirname+'/public/premiumThirdPage/index4.html');
        // res.send(`Our shorthened Url is: s.u/${customurl}` );

        data = " ";
        con.query(sqlforGraph, data, (err, result) => {
          if (err) {
            res.send("Something Went Wrong... Try Again...");
            console.log(err);
            // throw err;
            return;
          }
          result = result.map((v) => Object.assign({}, v));
          // console.log("result : ", result);
          res.render("premiumShortURLResponse", {
            shorturl: customurl,
            data: JSON.stringify(result),
          });
        });
      });
    } else {
      // console.log(result);
      res.send(
        `Try with other URL, This short Url already exits: s.u/${customurl}`
      );
    }
  });
});

/***********************Utilty Functions *******************/
server.listen(port, (e) => {
  console.log(`listening on port 8080-8080`);
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
    characters.charAt(Math.floor(Math.random() * charactersLength));
  return result;
}




































//API Part
var myCacheMap = new Map();
app.post('/api/createshorten/:apiKey', async function (req, res) {
  // create user in req.body
  let Email = await validateAPIkey(req.params.apiKey);
  if (Email == "F") {
    res.send("API key Invalid");
    return;
  }
  else {


    // console.log(req.body);
    // res.send("OK Test");
    // return;
    let sql = "INSERT Into urlMap Set ?";
    let url1 = await makeidapi();
    let longurl = req.body.urldata;
    let timestamp = new Date();
    let data = {
      email: Email,
      url: longurl,
      shortenedurl: url1,
      creation_timestamp: timestamp
    };
    let query = con.query(sql, data, (err, result) => {
      if (err) {
        res.send("Something Went Wrong... Try Again...")
        // console.log(err);
        return;
      }
      //   res.render("shortURLResponse", { shorturl: url1 });
      res.json({ shorturl: url1 });
    });
  }
});
// Create Custom Short URL
app.post('/api/createcustomshorten/:apiKey', async function (req, res) {
  // create user in req.body
  let Email = await validateAPIkey(req.params.apiKey);
  if (Email == "F") {
    res.send("API key Invalid");
    return;
  }
  //
  else {

    let Url = req.body.longurldata;
    let customurl = req.body.customurldata;
    let TTL = req.body.ttl;
    // console.log("Now",req.body.email);
    // console.log("OK",Url,customurl,TTL);
    let timestamp = new Date();
    if (Url == 'undefined' || Url == '' || customurl == 'undefined' || customurl == '') {
      res.send("No urldata given");
      return;
    }
    if (TTL == undefined || TTL > 120 || TTL == '') {
      TTL = 60;
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
        return;
      }
      if (result.length == 0) {
        let query = con.query(sqlinsert, datainsert, (err, result) => {
          if (err) {
            res.send("Something Went Wrong... Try Again...")
            console.log(err);
            return;
          }
          data = " ";
          //   res.render("premiumShortURLResponse", { shorturl: customurl });
          res.json({ shorturl: customurl });
        });
      } else {
        res.send(`Try with other URL, This short Url already exits`);
      }
    });
  }
});

// Read Normal Short URL
app.post('/api/readshorten/:apiKey', async function (req, res) {
  // create user in req.body
  let Email = await validateAPIkey(req.params.apiKey);
  if (Email == "F") {
    res.send("API key Invalid");
    return;
  }
  else {
    // console.log(req.params.shorturl);
    let data = " ";


    //**********************************To Upadate this LINk************************* /
    link = req.body.shorturl;
    if (link == undefined) {
      res.send("Can't Read URL");
      return;
    }

    //Using Cache
    if (myCacheMap.has(link)) {
      // console.log();
      // res.redirect(myCacheMap.get(link));
      res.json({ longURL: myCacheMap.get(link) });
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
    else {
      //Db query for link of shorturl
      let sql = `SELECT url,ttl,creation_timestamp from urlMap where shortenedurl = "${link}" ; `;
      con.query(sql, data, (err, result) => {
        if (err) {
          res.send("Something Went Wrong... Try Again...")
          return;
        }
        if (result.length == 0) {
          res.send("No URL for this ShortURL exits");
          return;
        }
        else {
          res.json({ longURL: result[0].url });
          halfMyCacheMap();
          myCacheMap.set(link, result[0].url);
          let sqlupdate = `UPDATE urlMap SET num_of_redirections = num_of_redirections + 1 where  shortenedurl = "${link}";`;
          let query = con.query(sqlupdate, data, (err, result) => {
            if (err) {
              //   console.log("Increment failed in redirection counts");
              return;
            }
          });
        }
      });
    }
  }
});

//Delete URL
app.post('/api/deleteurl/:apiKey', async function (req, res) {
  // create user in req.body
  let Email = await validateAPIkey(req.params.apiKey);
  if (Email == "F") {
    res.send("API key Invalid");
    return;
  }
  else {
    // console.log(req.params.shorturl);
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
          res.send("Something Went Wrong... Try Again...")
          return;
        }
        if (result.length == 0) {
          res.send("No URL for this ShortURL exits");
          return;
        }
        // res.json({longURL:result[0].url});
        // halfMyCacheMap();
        // myCacheMap.set(link,result[0].url);
        if (result[0].email == Email) {
          let sqldel = `DELETE from urlMap  where  shortenedurl = "${link}";`;
          let query = con.query(sqldel, data, (err, result) => {
            if (err) {
              //   console.log("Increment failed in redirection counts");
              return;
            }
            res.send("Delete Successful");
          });
        }
        else {
          res.send("Not enough permission");
          return;
        }

      });
      //Using Cache
      if (myCacheMap.has(link)) {
        myCacheMap.delete(link);
      }
    }
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

// app.listen(3000, (e) => {
//   console.log(`listening on  API port 3000`);
// });

async function makeidapi(/*length = 5*/) {
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

// let myPromise = new Promise(function(resolve) {
//   resolve("I love You !!");
// });
async function validateAPIkey(apiKey) {
  let sql = `SELECT * from urlMap where shortenedurl = "${apiKey}" ; `;
  let data = " ";
  let query = con.query(sql, data, (err, result) => {
    if (err) {
      console.log("Something Went Wrong... Try Again...");
      // new Promise(function(resolve) {
      //   resolve("F");
      // });
      return "F";
    }
    if (result.length == 0) {
      console.log("API Key Invalid");
      // new Promise(function(resolve) {
      //   resolve("F");
      // });
      return "F";
    }
    else {
      return result[0].email;
    }
    // new Promise(function(resolve) {
    //   resolve(result[0].email);
    // });
  });
}


function halfMyCacheMap() {
  if (myCacheMap.size > 3000000) {
    let cnt = 0;
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