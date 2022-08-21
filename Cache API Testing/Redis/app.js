/**
 * Importing Libraries
 */
const express = require('express')
const app = express()
const mysql = require('mysql')
const Redis = require('ioredis')

/**
 * Setting up the cache
 */
const myCacheMap = new Map()

/**
 * Initializing middleware
 */
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const redis = new Redis({
  host: 'redis-mysql-3.ncfh49.0001.aps1.cache.amazonaws.com',
  port: 6379
})

redis.on('connect', () => {})

// Databases
const con = mysql.createConnection({
  host: 'database-1.cpd14h2dbny0.ap-south-1.rds.amazonaws.com',
  user: 'admin', // DB
  password: 'shubhamgupta', // DB
  database: 'URL'
})

con.connect(function (err) {
  if (err) {
    throw err
  }
})

app.get('/home', (req, res) => {
  res.send('Ok')
})

// Create Custom Short URL
app.post('/api/createcustomshorten/:apiKey', async function (req, res) {
  // create user in req.body

  const apiKey = req.params.apiKey
  if (apiKey != 'CSD1234') {
    res.send('Please provide Dev API Key')
    return
  }

  const Url = req.body.longurldata
  const customurl = req.body.customurldata

  /**
   * Checking for the undefined values
   */
  if (
    Url == 'undefined' ||
    Url == '' ||
    customurl == 'undefined' ||
    customurl == ''
  ) {
    res.send('No urldata given')
    return
  }

  /**
   * SQL query to insert the data into the URL table
   */
  const sqlinsert = 'INSERT Into urlMap Set ?'
  const datainsert = {
    url: Url,
    shortenedurl: customurl
  }

  /**
   * SQL query to search the data corresponding the given short url
   */
  const sqlsearch = `SELECT * from urlMap where  shortenedurl = "${customurl}" ;`
  const datasearch = ' '
  con.query(sqlsearch, datasearch, (err, result) => {
    if (err) {
      res.send('Something Went Wrong... Try Again...')

      return
    }

    /**
     * If the given custom url is not present in the DB
     */
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
})

// Read Normal Short URL
app.post('/api/readshorten/:apiKey', async function (req, res) {
  // create user in req.body

  const apiKey = req.params.apiKey
  if (apiKey != 'CSD1234') {
    res.send('Please provide Dev API Key')
    return
  }

  link = req.body.shorturl
  const data = ' '
  if (link == undefined) {
    res.send("Can't Read URL")
    return
  }

  redis.get(link, (err, reply) => {
    if (err) {
    }
    if (reply !== null) {
      res.json({ longURL: reply })
    } else {
      {
        const sql = `SELECT url from urlMap where shortenedurl = "${link}" ; `
        con.query(sql, data, (err, result) => {
          if (err) {
            res.send('Something Went Wrong... Try Again...')
            return
          }
          if (result.length == 0) {
            res.send('No URL for this ShortURL exits')
          } else {
            res.json({ longURL: result[0].url })
            redis.set(link, result[0].url)
          }
        })
      }
    }
  })
})

// UTILITY FUNCtion
app.listen(process.env.PORT || 8080, (e) => {})
