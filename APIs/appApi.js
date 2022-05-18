const express = require("express");
const app = express();
var mysql = require("mysql");

var myCacheMap = new Map();

// const server = require("http").Server(app);
var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Databases
var con = mysql.createConnection({
    host: "aa10f4pikqa37be.ci44ziqzvjp1.us-east-1.rds.amazonaws.com",
    user: "shubham1194", //DB
    password: "shubhamgupta", //DB
    database: "URL",
});

con.connect(function(err) {
    if (err) {
        console.log('Error in Databse connection');
        throw err;
    }
    console.log("Connected Databse!");
});

//Create Short URL
app.post('/api/createshorten/:apiKey', async function(req, res) {
    // create user in req.body
    let Email = await validateAPIkey(req.params.apiKey);
    if (Email == "F") {
        res.send("API key Invalid");
        return;
    } else {
        let sql = "INSERT Into urlMap Set ?";
        let url1 = await makeid();
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
                return;
            }
            res.json({ shorturl: url1 });
        });
    }
});

// Create Custom Short URL
app.post('/api/createcustomshorten/:apiKey', async function(req, res) {

    // create user in req.body
    let Email = await validateAPIkey(req.params.apiKey);
    if (Email == "F") {
        res.send("API key Invalid");
        return;
    } else {
        let Url = req.body.longurldata;
        let customurl = req.body.customurldata;
        let TTL = req.body.ttl;
        let timestamp = new Date();
        if (Url == 'undefined' || Url == '' || customurl == 'undefined' || customurl == '') {
            res.send("No urldata given");
            return;
        }
        if (TTL == undefined || TTL > 120 || TTL == '') {
            TTL = 60;
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
                    res.json({ shorturl: customurl });
                });
            } else {
                res.send(`Try with other URL, This short Url already exits`);
            }
        });
    }
});

// Read Normal Short URL
app.post('/api/readshorten/:apiKey', async function(req, res) {
    // create user in req.body
    let Email = await validateAPIkey(req.params.apiKey);
    if (Email == "F") {
        res.send("API key Invalid");
        return;
    } else {
        let data = " ";
        //**********************************To Update this LINk************************* /
        link = req.body.shorturl;
        if (link == undefined) {
            res.send("Can't Read URL");
            return;
        }

        //Using Cache
        if (myCacheMap.has(link)) {

            res.json({ longURL: myCacheMap.get(link) });

            //Update redirection count
            let sqlupdate = `UPDATE urlMap SET num_of_redirections = num_of_redirections + 1 where  shortenedurl = "${link}";`;
            let query = con.query(sqlupdate, data, (err, result) => {
                if (err) {
                    console.log("Increment failed in redirection counts");
                    return;
                }
            });
            return;
        } else {

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
                } else {
                    res.json({ longURL: result[0].url });
                    halfMyCacheMap();
                    myCacheMap.set(link, result[0].url);
                    let sqlupdate = `UPDATE urlMap SET num_of_redirections = num_of_redirections + 1 where  shortenedurl = "${link}";`;
                    let query = con.query(sqlupdate, data, (err, result) => {
                        if (err) {
                            return;
                        }
                    });
                }
            });
        }
    }
});

//Delete URL
app.post('/api/deleteurl/:apiKey', async function(req, res) {
    // create user in req.body
    let Email = await validateAPIkey(req.params.apiKey);
    if (Email == "F") {
        res.send("API key Invalid");
        return;
    } else {
        let data = " ";
        //**********************************To Update this LINk************************* /
        link = req.body.shorturl;
        if (link == undefined) {
            res.send("Can't Read URL");
            return;
        } else {
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
                if (result[0].email == Email) {
                    let sqldel = `DELETE from urlMap  where  shortenedurl = "${link}";`;
                    let query = con.query(sqldel, data, (err, result) => {
                        if (err) {
                            return;
                        }
                        res.send("Delete Successful");
                    });
                } else {
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

var port = process.env.PORT || 8080;

app.listen(port, (e) => {
    console.log("CALLING APP API JS")
    console.log(`listening on  API port 3000`);
});

async function makeid( /*length = 5*/ ) {
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

async function validateAPIkey(apiKey) {
    let sql = `SELECT * from urlMap where shortenedurl = "${apiKey}" ; `;
    let data = " ";
    let query = con.query(sql, data, (err, result) => {
        if (err) {
            console.log("Something Went Wrong... Try Again...");
            return "F";
        }
        if (result.length == 0) {
            console.log("API Key Invalid");
            return "F";
        } else {
            return result[0].email;
        }
    });
}

function halfMyCacheMap() {
    if (myCacheMap.size > 3000000) {
        let cnt = 0;
        myCacheMap.clear();
    }
}