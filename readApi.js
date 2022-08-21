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

// Read Normal Short URL
app.post('/api/readshorten/:apiKey', async function (req, res) {
  // create user in req.body
  const apiKey = req.params.apiKey
  if (apiKey != 'CSD1234') {
    res.send('Please provide Dev API Key')
    return
  }

  /**
   * Searching the Email for the corresponding API key
   */
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

      // Update redirection count
      const sqlupdate = `UPDATE urlMap SET num_of_redirections = num_of_redirections + 1 where  shortenedurl = "${link}";`
      const query = con.query(sqlupdate, data, (err, result) => {
        if (err) {
        }
      })
    } else {
      {
        // **********************************To Update this LINk************************* /
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
            redis.set(link, result[0].url)

            // Update redirection count
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
