const express = require('express')
const app = express()
const mysql = require('mysql')

const myCacheMap = new Map()

// const server = require("http").Server(app);
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Databases
const con = mysql.createConnection({
  host: 'aa10f4pikqa37be.ci44ziqzvjp1.us-east-1.rds.amazonaws.com',
  user: 'shubham1194', // DB
  password: 'shubhamgupta', // DB
  database: 'URL'
})

con.connect(function (err) {
  if (err) {
    throw err
  }
})

// Create Short URL
app.post('/api/createshorten/:apiKey', async function (req, res) {
  // create user in req.body
  const Email = await validateAPIkey(req.params.apiKey)
  if (Email == 'F') {
    res.send('API key Invalid')
  } else {
    const sql = 'INSERT Into urlMap Set ?'
    const url1 = await makeid()
    const longurl = req.body.urldata
    const timestamp = new Date()
    const data = {
      email: Email,
      url: longurl,
      shortenedurl: url1,
      creation_timestamp: timestamp
    }
    const query = con.query(sql, data, (err, result) => {
      if (err) {
        res.send('Something Went Wrong... Try Again...')
        return
      }
      res.json({ shorturl: url1 })
    })
  }
})

// Create Custom Short URL
app.post('/api/createcustomshorten/:apiKey', async function (req, res) {
  // create user in req.body
  const Email = await validateAPIkey(req.params.apiKey)
  if (Email == 'F') {
    res.send('API key Invalid')
  } else {
    const Url = req.body.longurldata
    const customurl = req.body.customurldata
    let TTL = req.body.ttl
    const timestamp = new Date()
    if (
      Url == 'undefined' ||
      Url == '' ||
      customurl == 'undefined' ||
      customurl == ''
    ) {
      res.send('No urldata given')
      return
    }
    if (TTL == undefined || TTL > 120 || TTL == '') {
      TTL = 60
    }
    const sqlinsert = 'INSERT Into urlMap Set ?'
    const datainsert = {
      url: Url,
      shortenedurl: customurl,
      ttl: TTL,
      creation_timestamp: timestamp,
      num_of_redirections: 0,
      email: Email
    }
    const sqlsearch = `SELECT * from urlMap where  shortenedurl = "${customurl}" ;`
    const datasearch = ' '
    con.query(sqlsearch, datasearch, (err, result) => {
      if (err) {
        res.send('Something Went Wrong... Try Again...')

        return
      }
      if (result.length == 0) {
        const query = con.query(sqlinsert, datainsert, (err, result) => {
          if (err) {
            res.send('Something Went Wrong... Try Again...')

            return
          }
          data = ' '
          res.json({ shorturl: customurl })
        })
      } else {
        res.send('Try with other URL, This short Url already exits')
      }
    })
  }
})

// Read Normal Short URL
app.post('/api/readshorten/:apiKey', async function (req, res) {
  // create user in req.body
  const Email = await validateAPIkey(req.params.apiKey)
  if (Email == 'F') {
    res.send('API key Invalid')
  } else {
    const data = ' '
    //* *********************************To Update this LINk************************* /
    link = req.body.shorturl
    if (link == undefined) {
      res.send("Can't Read URL")
      return
    }

    // Using Cache
    if (myCacheMap.has(link)) {
      res.json({ longURL: myCacheMap.get(link) })

      // Update redirection count
      const sqlupdate = `UPDATE urlMap SET num_of_redirections = num_of_redirections + 1 where  shortenedurl = "${link}";`
      const query = con.query(sqlupdate, data, (err, result) => {
        if (err) {
        }
      })
    } else {
      // Db query for link of shorturl
      const sql = `SELECT url,ttl,creation_timestamp from urlMap where shortenedurl = "${link}" ; `
      con.query(sql, data, (err, result) => {
        if (err) {
          res.send('Something Went Wrong... Try Again...')
          return
        }
        if (result.length == 0) {
          res.send('No URL for this ShortURL exits')
        } else {
          res.json({ longURL: result[0].url })
          halfMyCacheMap()
          myCacheMap.set(link, result[0].url)
          const sqlupdate = `UPDATE urlMap SET num_of_redirections = num_of_redirections + 1 where  shortenedurl = "${link}";`
          const query = con.query(sqlupdate, data, (err, result) => {
            if (err) {
            }
          })
        }
      })
    }
  }
})

// Delete URL
app.post('/api/deleteurl/:apiKey', async function (req, res) {
  // create user in req.body
  const Email = await validateAPIkey(req.params.apiKey)
  if (Email == 'F') {
    res.send('API key Invalid')
  } else {
    const data = ' '
    //* *********************************To Update this LINk************************* /
    link = req.body.shorturl
    if (link == undefined) {
      res.send("Can't Read URL")
    } else {
      // check user has right over URl
      const sql = `SELECT email,url,ttl,creation_timestamp from urlMap where shortenedurl = "${link}" ; `
      con.query(sql, data, (err, result) => {
        if (err) {
          res.send('Something Went Wrong... Try Again...')
          return
        }
        if (result.length == 0) {
          res.send('No URL for this ShortURL exits')
          return
        }
        if (result[0].email == Email) {
          const sqldel = `DELETE from urlMap  where  shortenedurl = "${link}";`
          const query = con.query(sqldel, data, (err, result) => {
            if (err) {
              return
            }
            res.send('Delete Successful')
          })
        } else {
          res.send('Not enough permission')
        }
      })
      // Using Cache
      if (myCacheMap.has(link)) {
        myCacheMap.delete(link)
      }
    }
  }
})

const port = process.env.PORT || 8080

app.listen(port, (e) => {})

async function makeid (/* length = 5 */) {
  let result = ''
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  result =
    characters.charAt(Math.floor(Math.random() * charactersLength)) +
    characters.charAt(Math.floor(Math.random() * charactersLength)) +
    characters.charAt(Math.floor(Math.random() * charactersLength)) +
    characters.charAt(Math.floor(Math.random() * charactersLength)) +
    characters.charAt(Math.floor(Math.random() * charactersLength)) +
    characters.charAt(Math.floor(Math.random() * charactersLength))
  return result
}

async function validateAPIkey (apiKey) {
  const sql = `SELECT * from urlMap where shortenedurl = "${apiKey}" ; `
  const data = ' '
  const query = con.query(sql, data, (err, result) => {
    if (err) {
      return 'F'
    }
    if (result.length == 0) {
      return 'F'
    } else {
      return result[0].email
    }
  })
}

function halfMyCacheMap () {
  if (myCacheMap.size > 3000000) {
    const cnt = 0
    myCacheMap.clear()
  }
}
