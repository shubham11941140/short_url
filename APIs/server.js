const express = require("express");
const app = express();
const ejs = require("ejs");
var mysql = require("mysql");
var nodemailer = require("nodemailer");

var exec = require('child_process').exec,
    child;

child = exec('node appApi.js {{args}}',
    function(error, stdout, stderr) {
        console.log("CHILD PROCESS APPAPI JS IS EXECUTED BY GUPTA")
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        if (error !== null) {
            console.log('exec error: ' + error);
        }
    });

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

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log("Email sent: " + info.response);
        }
    });
}

const server = require("http").Server(app);
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());

var port = process.env.PORT || 8080; // set the port of our application

console.log("Listening at the right port");

app.set("view engine", "ejs");

// Databases
var con = mysql.createConnection({
    host: "aa10f4pikqa37be.ci44ziqzvjp1.us-east-1.rds.amazonaws.com",
    user: "shubham1194", //DB
    password: "shubhamgupta", //DB
    database: "URL",
});

con.connect(function(err) {
    if (err) {
        console.log("Error in Database connection");
        throw err;
    }
    console.log("Connected Database!");
});

//Just random Things Done To generate Graph
const tableData = [{
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
    console.log(":params received");
    link = req.params.shorturl;
    if (link == undefined) {
        res.send("Can't Read URL");
        return;
    }
    let data = " ";
    let sql = `SELECT url from urlMap where shortenedurl = "${link}" ; `;
    let query = con.query(sql, data, (err, result) => {
        if (err) {
            res.send("Something Went Wrong... Try Again...");
            console.log(err);
            return;
        }
        if (result.length == 0) {
            res.send("No URL for this ShortURL exits");
            return;
        }
        console.log(result[0].url);
        res.redirect(result[0].url);
        let sqlupdate = `UPDATE urlMap SET num_of_redirections = num_of_redirections + 1 where  shortenedurl = "${link}";`;
        let query = con.query(sqlupdate, data, (err, result) => {
            if (err) {
                console.log("Increment failed in redirection counts");
                return;
            }
        });
    });
});

/**************************POST *****************8*/
app.post("/nonpremiumurl", async(req, res) => {
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
            return;
        }
        if (result.length == 0) {
            let query = con.query(sql, data, (err, result) => {
                if (err) {
                    res.send("Something Went Wrong... Try Again...");
                    console.log(err);
                    return;
                }
                flag = false;
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
                    return;
                }
                flag = false;
                res.send(`Our shorthened Url is: s.u/${url1}`);
            });
        }
    });
});

app.post("/nonpremiumOTPcreate", (req, res) => {
    Email = req.body.jsonemail;
    res.send("Ok Sending to JS fetch");
    let Otp = Math.floor(Math.random() * 100000);
    let Time = new Date();
    let sql = "INSERT Into emailOTP Set ?";
    let data = { email: Email, otp: Otp, time: Time };
    let sqlsearch = `SELECT * from emailOTP where  email = "${Email}" ;`; {
        let querysearch = con.query(sqlsearch, data, (err, result) => {
            if (err) {
                console.log(err);
                return;
            }
            if (result.length > 0) {
                let sqldelete = `DELETE from emailOTP where  email = "${Email}" ;`;
                let querydelete = con.query(sqldelete, data, (err, result) => {
                    if (err) {
                        console.log(err);
                        return;
                    }
                });
            }
            let query = con.query(sql, data, (err, result) => {
                if (err) {
                    console.log(err);
                    return;
                }
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

    let sqlforGraph = `select url, shortenedurl, creation_timestamp, num_of_redirections
        from urlMap
        where email = "${Email}"
        order by creation_timestamp DESC
        limit 15;`;

    let sqlsearch = `SELECT * from emailOTP where  email = "${Email}" ;`; {
        let querysearch = con.query(sqlsearch, data, (err, result) => {
            if (err) {
                res.send("Something Went Wrong... Try Again...");
                console.log(err);
                return;
            }
            if (result.length > 0) {
                let timetaken = Time - result[0].time;
                timetaken /= 1000;
                if (result[0].otp == OTPgiven) {
                    if (timetaken <= 300) {
                        con.query(sqlforGraph, data, (err, result) => {
                            if (err) {
                                res.send("Something Went Wrong... Try Again...");
                                console.log(err);
                                return;
                            }
                            result = result.map((v) => Object.assign({}, v));
                            res.render("premiumForm", {
                                email: Email,
                                data: JSON.stringify(result),
                            }); // dataGraph: result
                        });
                    } else res.send("OTP expired");
                } else res.send("OTP sent wrong");
            } else {
                res.send("No OTP found");
            }
        });
    }
});

app.post("/test", (req, res) => {
    res.send("Testing Route..");
});

app.post("/customurl", (req, res) => {
    let Url = req.body.urldata;
    let customurl = req.body.customurldata;
    let TTL = req.body.TTL;
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
    }

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
            return;
        }
        if (result.length == 0) {
            let query = con.query(sqlinsert, datainsert, (err, result) => {
                if (err) {
                    res.send("Something Went Wrong... Try Again...");
                    console.log(err);
                    return;
                }

                data = " ";
                con.query(sqlforGraph, data, (err, result) => {
                    if (err) {
                        res.send("Something Went Wrong... Try Again...");
                        console.log(err);
                        return;
                    }
                    result = result.map((v) => Object.assign({}, v));
                    res.render("premiumShortURLResponse", {
                        shorturl: customurl,
                        data: JSON.stringify(result),
                    });
                });
            });
        } else {
            res.send(
                `Try with other URL, This short Url already exits: s.u/${customurl}`
            );
        }
    });
});

/***********************Utilty Functions *******************/
server.listen(port, (e) => {
    console.log(`GUPTA IS MY NAME listening on port 8080-8080`);
});

function makeid( /*length = 5*/ ) {
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