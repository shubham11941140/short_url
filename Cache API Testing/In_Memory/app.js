const express = require("express"); 
const app = express(); 
var mysql = require("mysql"); 
 
var myCacheMap = new Map(); 
 
var bodyParser = require("body-parser"); 
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 
 
// Databases 
var con = mysql.createConnection({ 
    host: "database-1.cpd14h2dbny0.ap-south-1.rds.amazonaws.com", 
    user: "admin", //DB 
    password: "shubhamgupta", //DB 
    database: "URL", 
}); 
 
con.connect(function(err) { 
    if (err) { 
         
        throw err; 
    } 
     
}); 
 
// Create Custom Short URL 
app.post("/api/createcustomshorten/:apiKey", async function(req, res) { 
 
    let apiKey = req.params.apiKey; 
    if (apiKey != 'CSD1234') { 
        res.send('Please provide Dev API Key'); 
        return; 
    } 
    let Url = req.body.longurldata; 
    let customurl = req.body.customurldata; 
    if ( 
        Url == "undefined" || 
        Url == "" || 
        customurl == "undefined" || 
        customurl == "" 
    ) { 
        res.send("No urldata given"); 
        return; 
    } 
 
    let sqlinsert = "INSERT Into urlMap Set ?"; 
    let datainsert = { 
        url: Url, 
        shortenedurl: customurl, 
    }; 
 
    let sqlsearch = `SELECT * from urlMap where  shortenedurl = "${customurl}" ;`; 
    let datasearch = " "; 
    con.query(sqlsearch, datasearch, (err, result) => { 
        if (err) { 
            res.send("Something Went Wrong... Try Again..."); 
             
            return; 
        } 
 
        if (result.length == 0) { 
            let query = con.query(sqlinsert, datainsert, (err, result) => { 
                if (err) { 
                    res.send("Something Went Wrong... Try Again..."); 
                     
                    return; 
                } 
                data = " "; 
                res.json({ shorturl: customurl }); 
            }); 
        } else { 
            res.send(`Try with other URL, This short Url already exits`); 
        } 
    }); 
}); 
 
// Read Normal Short URL 
app.post("/api/readshorten/:apiKey", async function(req, res) { 
    // create user in req.body 
 
    let apiKey = req.params.apiKey; 
    if (apiKey != 'CSD1234') { 
        res.send('Please provide Dev API Key'); 
        return; 
    } 
 
    link = req.body.shorturl; 
    let data = " "; 
    if (link == undefined) { 
        res.send("Can't Read URL"); 
        return; 
    } 
 
    if (myCacheMap.has(link)) { 
        res.json({ longURL: myCacheMap.get(link) }); 
        return; 
    } else { 
 
        let sql = `SELECT url from urlMap where shortenedurl = "${link}" ; `; 
        con.query(sql, data, (err, result) => { 
            if (err) { 
                res.send("Something Went Wrong... Try Again..."); 
                return; 
            } 
            if (result.length == 0) { 
                res.send("No URL for this ShortURL exits"); 
                return; 
            } else { 
                res.json({ longURL: result[0].url }); 
                insertInMem(link, result[0].url); 
            } 
        }); 
 
    } 
}); 
 
app.get("/:temp", (req, res) => { 
    res.send("Ok"); 
}); 
 
//UTILITY FUNCtion 
app.listen(process.env.PORT || 8080, (e) => { 
     
}); 
 
function halfMyCacheMap() { 
    if (myCacheMap.size > 3000000) { 
        let cnt = 0; 
        for (const [key, value] of myCacheMap.entries()) { 
            myMap.delete(key); 
            cnt++; 
            if (cnt >= 1500000) 
                break; 
        } 
    } 
} 
 
function insertInMem(link, url) { 
    halfMyCacheMap(); 
    myCacheMap.set(link, url); 
}