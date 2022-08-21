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

// Setting up the database
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

// Redis DB
const redis = new Redis({
  host: 'localhost',
  port: 6379
})

redis.on('connect', () => {})

// Create Short URL
app.post('/api/createshorten/:apiKey', async function (req, res) {
  const apiKey = req.params.apiKey
  if (apiKey != 'CSD1234') {
    res.send('Please provide Dev API Key')
    return
  }
  /**
   * SQL query to check the API key for the particular Email
   */
  const sql = 'INSERT Into urlMap Set ?'
  const url1 = makeid()
  const longurl = req.body.urldata

  if (longurl == undefined) {
    res.send('Provide URL' + longurl)
    return
  }

  const timestamp = new Date()

  const data = {
    url: longurl,
    shortenedurl: url1,
    creation_timestamp: timestamp
  }

  /**
   * SQL query to insert the data into DB
   */
  const query = con.query(sql, data, (err, result) => {
    if (err) {
      res.send('Something Went Wrong... Try Again...')
      return
    }

    /** Send back the response of short URL */
    res.json({ shorturl: url1 })
  })
})

// Create Custom Short URL
app.post('/api/createcustomshorten/:apiKey', async function (req, res) {
  // create user in req.body

  const apiKey = req.params.apiKey
  if (apiKey != 'CSD1234') {
    res.send('Please provide Dev API Key')
    return
  }
  /**
   * SQL query to check the API key for the particular Email
   */
  const Url = req.body.longurldata
  const customurl = req.body.customurldata
  let TTL = req.body.ttl
  const timestamp = new Date()

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

  if (TTL == undefined || TTL > 120 || TTL == '') {
    TTL = 60
  }

  /**
   * SQL query to insert the data into the URL table
   */
  const sqlinsert = 'INSERT Into urlMap Set ?'
  const datainsert = {
    url: Url,
    shortenedurl: customurl,
    ttl: TTL,
    creation_timestamp: timestamp,
    num_of_redirections: 0
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

// Delete URL
app.post('/api/deleteurl/:apiKey', async function (req, res) {
  // create user in req.body
  const apiKey = req.params.apiKey
  if (apiKey != 'CSD1234') {
    res.send('Please provide Dev API Key')
    return
  }

  /**
   * Search for the Email for the corresponding API key
   */
  const sqlapi = `SELECT email from emailAPIKeys where apikey = "${apiKey}" ; `
  const dataapi = ' '
  con.query(sqlapi, dataapi, (err, result) => {
    if (err) {
      res.send('Please Try again')
    } else if (result.length == 0) {
      res.send('API key not valid')
    } else {
      Email = result[0].email
      const data = ' '

      //* *********************************To Upadate this LINk************************* /
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

          /**
           * If the current user Email is equal to the Email from which the short url was created
           * then user can delete the short url
           */
          if (result[0].email == Email) {
            const sqldel = `DELETE from urlMap  where  shortenedurl = "${link}";`
            const query = con.query(sqldel, data, (err, result) => {
              if (err) {
                return
              }

              res.send('Delete Successful')
              redis.del(link)
            })
          } else {
            const sqldel = `DELETE from urlMap  where  shortenedurl = "${link}";`
            const query = con.query(sqldel, data, (err, result) => {
              if (err) {
                return
              }

              res.send('Delete Successful')
              redis.del(link)
            })
          }
        })
      }
    }
  })
})

// UTILITY FUNCtion
app.listen(7000, (e) => {})

/**
 * Function to generate the random string of 11 characters from a set of preselected 62 characters
 */
function makeid (/* length = 5 */) {
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
