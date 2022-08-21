// Library Imports
const express = require('express')
const app = express()
const ejs = require('ejs')
const mysql = require('mysql')
const nodemailer = require('nodemailer')

// Function to send the mail from temporary mail account
function helperForSendOTP (emaildb, otpdb, apiKey) {
  // This is to establish the connection
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'kingtemp204000@gmail.com', // EMAIL
      pass: 'ShubhamGupta' // Password
    }
  })

  // This is to set the mail options
  const mailOptions = {
    from: 'kingtemp204000@gmail.com', // Your Email
    to: emaildb,
    subject: 'OTP for URL shortener',
    text: `Your OTP for URL shortener is ${otpdb}. It will expire in 5 minutes. Your API key is  "${apiKey}".`
  }

  // Sending the mail through the library
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
    } else {
    }
  })
}

// Setting up the cache
const myCacheMap = new Map()

// Setting up the middleware
const server = require('http').Server(app)
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(express.json())

app.set('view engine', 'ejs')

// Connecting to the database
const con = mysql.createConnection({
  host: 'database-2.cqztcdymd18c.us-east-1.rds.amazonaws.com',
  user: 'admin', // DB
  password: 'shubhamgupta1', // DB
  database: 'URL'
})

con.connect(function (err) {
  if (err) {
    throw err
  }
})

// Just random Things Done To generate Graph
const tableData = [
  {
    url: 'https://www.google.com',
    shortenedurl: 'okgoogly123',
    creation_timestamp: '12-Jan-2022',
    num_of_redirections: 0
  },
  {
    url: 'https://www.google.com',
    shortenedurl: 'okgoogly123',
    creation_timestamp: '12-Jan-2022',
    num_of_redirections: 0
  },
  {
    url: 'https://www.google.com',
    shortenedurl: 'okgoogly123',
    creation_timestamp: '12-Jan-2022',
    num_of_redirections: 0
  },
  {
    url: 'https://www.google.com',
    shortenedurl: 'okgoogly123',
    creation_timestamp: '12-Jan-2022',
    num_of_redirections: 0
  },
  {
    url: 'https://www.google.com',
    shortenedurl: 'okgoogly123',
    creation_timestamp: '12-Jan-2022',
    num_of_redirections: 0
  },
  {
    url: 'https://www.google.com',
    shortenedurl: 'okgoogly123',
    creation_timestamp: '12-Jan-2022',
    num_of_redirections: 0
  }
]

const graphData = []
for (let i = 0; i < 15; i++) {
  graphData.push({
    curr_date: `${i + 1}-Jan-2022`,
    readcount: Math.random() * 60,
    writecount: Math.random() * 60
  })
}

/** *************************GET *******************/
// website http GET request is redirected to '/home' route
app.get('/', (req, res) => {
  res.redirect('/home')
})

// the homepage.ejs is rendered here
app.get('/home', (req, res) => {
  res.render('homepage', {
    shorturl: 'tfuykfc',
    email: 'yoyo@iitbhilai.ac.in',
    data: JSON.stringify(tableData),
    graphData: JSON.stringify(graphData)
  })
})

// here we are getting the request for short url
app.get('/:shorturl', (req, res) => {
  const data = ' '
  link = req.params.shorturl

  if (link == undefined) {
    res.send("Can't Read URL")
    return
  }

  // if the link for short url is in cache, then directly send it from cache
  if (myCacheMap.has(link)) {
    res.redirect(myCacheMap.get(link))

    // Update redirection count
    /* SQL query to update the num_of_redirections field in DB */
    const sqlupdate = `UPDATE urlMap SET num_of_redirections = num_of_redirections + 1 where  shortenedurl = "${link}";`
    const query = con.query(sqlupdate, data, (err, result) => {
      if (err) {
      }
    })

    return
  }

  /* SQL query to get the data corresponding to the short url */
  const sql = `SELECT url,ttl,creation_timestamp from urlMap where shortenedurl = "${link}" ; `
  const query = con.query(sql, data, (err, result) => {
    if (err) {
      res.send('Something Went Wrong... Try Again...')

      return
    }

    if (result.length == 0) {
      res.send('No URL for this ShortURL exits')
      return
    }

    /* Redirect to the long url and put it in the cache */
    res.redirect(result[0].url)
    halfMyCacheMap()
    myCacheMap.set(link, result[0].url)

    /* SQL query to update the num_of_redirections field in DB */
    const sqlupdate = `UPDATE urlMap SET num_of_redirections = num_of_redirections + 1 where  shortenedurl = "${link}";`
    const query = con.query(sqlupdate, data, (err, result) => {
      if (err) {
      }
    })
  })
})

/** ************************POST *******************/

/* route to get the POST request for Non Premium URL */
app.post('/nonpremiumurl', async (req, res) => {
  const sql = 'INSERT Into urlMap Set ?'
  let flag = true

  const timestamp = new Date()
  const url1 = makeid()
  const data = {
    url: req.body.urldata,
    shortenedurl: url1,
    creation_timestamp: timestamp
  }

  /* SQL query to search already present short url in DB */
  const sqlsearch = `SELECT * from urlMap where shortenedurl = "${url1}" ;`
  const querysearch = con.query(sqlsearch, data, (err, result) => {
    if (err) {
      res.send('Something Went Wrong... Try Again...')

      return
    }

    /* if generated short url is not present in DB */
    if (result.length == 0) {
      /* SQL query to insert data in DB */
      const query = con.query(sql, data, (err, result) => {
        if (err) {
          res.send('Something Went Wrong... Try Again...')

          return
        }
        flag = false

        /* sending the response to render the shortURLResponse page with short url for given link */
        res.render('shortURLResponse', { shorturl: url1 })
      })
    } else {
      /* if generated short url is not present in DB */
      const url1 = makeid()
      const data = { url: req.body.urldata, shortenedurl: url1 }
      const sqlsearch = `SELECT * from urlMap where  shortenedurl = "${url1}" ;`
      const query = con.query(sql, data, (err, result) => {
        if (err) {
          res.send('Something Went Wrong... Try Again...')

          return
        }

        flag = false

        /* sending the response to render the shortURLResponse page with short url for given link */
        res.render('shortURLResponse', { shorturl: url1 })
      })
    }
  })
})

/* route to create the OTP and send the mail to the user */
app.post('/nonpremiumOTPcreate', (req, res) => {
  Email = req.body.jsonemail

  res.send('Ok Sending to JS fetch')

  // Create OTP
  const Otp = Math.floor(Math.random() * 100000)
  const Time = new Date()

  // Store OTP and store in DB

  // Query DB if OTP exists for email
  // if expired overwrite it
  // if not expired then do nothing
  const sql = 'INSERT Into emailOTP Set ?'
  const data = { email: Email, otp: Otp, time: Time }
  const sqlsearch = `SELECT * from emailOTP where  email = "${Email}" ;`
  {
    const querysearch = con.query(sqlsearch, data, (err, result) => {
      if (err) {
        return
      }

      /**
       * SQL query to delete the otp from the DB, because it has expired
       */
      if (result.length > 0) {
        const sqldelete = `DELETE from emailOTP where  email = "${Email}" ;`
        const querydelete = con.query(sqldelete, data, (err, result) => {
          if (err) {
          }
        })
      }

      /**
       * SQL query to insert the OTP into the DB
       */
      const query = con.query(sql, data, (err, result) => {
        if (err) {
          return
        }

        // SEND OTP to user
        // via mailto function
        // Third party API for mail sending
        // email, otp
        let apiKey = makeAPIKey()

        /**
         * SQL query to search whether the API key for particular Email already exists
         */
        const sqlAPISearch = `SELECT * from emailAPIKeys where  email = "${Email}" ;`
        con.query(sqlAPISearch, data, (err, result) => {
          if (err) {
            return
          }

          /**
           * If API key is already present, then initialize it from there
           */
          if (result.length > 0) {
            apiKey = result[0].apikey
          } else {
            const sqlAPIinsert = 'INSERT Into emailAPIKeys Set ?'
            const data = { email: Email, apikey: apiKey }
            con.query(sqlAPIinsert, data, (err, result) => {
              if (err) {
              }
            })
          }

          helperForSendOTP(Email, Otp, apiKey)
        })
      })
    })
  }
})

/**
 * Route to verify the OTP for given Email of user
 */
app.post('/nonpremiumOTPverify', (req, res) => {
  Email = req.body.email

  const Time = new Date()
  const OTPgiven = req.body.otp
  // Store OTP and store in DB
  const data = ' '

  if (Email == '' || OTPgiven == '') {
    res.send('No Email/OTP Found')
    return
  }

  // Query DB if OTP exists for email
  // if expired overwrite it
  // if not expired then do nothing

  /**
   * SQL query to get the short urls generated by the premium user to present in the table
   */
  const sqlforGraph = `select url, shortenedurl, creation_timestamp, num_of_redirections 
            from urlMap 
            where email = "${Email}" 
            order by creation_timestamp DESC 
            limit 15;`

  /**
   * SQL query to check for the OTP in the DB
   */
  const sqlsearch = `SELECT * from emailOTP where  email = "${Email}" ;`
  {
    const querysearch = con.query(sqlsearch, data, (err, result) => {
      if (err) {
        res.send('Something Went Wrong... Try Again...')

        return
      }

      /**
       * Checking whether the OTP has been entered in time
       */
      if (result.length > 0) {
        let timetaken = Time - result[0].time
        timetaken /= 1000

        if (result[0].otp == OTPgiven) {
          // Time verified
          if (timetaken <= 300) {
            con.query(sqlforGraph, data, (err, result) => {
              if (err) {
                res.send('Something Went Wrong... Try Again...')

                return
              }

              /**
               * Rendering the premiumForm page along with the table data
               */
              result = result.map((v) => Object.assign({}, v))
              res.render('premiumForm', {
                email: Email,
                data: JSON.stringify(result)
              }) // dataGraph: result
            })
          } else res.send('OTP expired')
        } else res.send('OTP sent wrong')
      } else {
        res.send('No OTP found')
      }
    })
  }
})

/**
 * Route to test the server
 */
app.post('/test', (req, res) => {
  res.send('Testing Route..')
})

/**
 * Route to present the short url to premium user
 */
app.post('/customurl', (req, res) => {
  const Url = req.body.urldata
  const customurl = req.body.customurldata
  let TTL = req.body.TTL
  const timestamp = new Date()

  /**
   * Checking for undefined values
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
   * SQL query to get the short urls generated by the premium user to present in the table
   */
  const sqlforGraph = `select url, shortenedurl, creation_timestamp, num_of_redirections 
            from urlMap 
            where email = "${Email}" 
            order by creation_timestamp DESC 
            limit 15;`

  /**
   * SQL query to insert the data into URL table
   */
  const sqlinsert = 'INSERT Into urlMap Set ?'
  const datainsert = {
    url: Url,
    shortenedurl: customurl,
    ttl: TTL,
    creation_timestamp: timestamp,
    num_of_redirections: 0,
    email: req.body.email
  }

  /**
   * SQL query to search whether the generated shortened url already exists in the DB
   */
  const sqlsearch = `SELECT * from urlMap where  shortenedurl = "${customurl}" ;`
  const datasearch = ' '
  const querysearch = con.query(sqlsearch, datainsert, (err, result) => {
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
        con.query(sqlforGraph, data, (err, result) => {
          if (err) {
            res.send('Something Went Wrong... Try Again...')

            return
          }

          result = result.map((v) => Object.assign({}, v))

          /**
           * Rendering the short url page for premium user along with the table data
           */
          res.render('premiumShortURLResponse', {
            shorturl: customurl,
            data: JSON.stringify(result)
          })
        })
      })
    } else {
      /**
       * If the short url already exists then send the error
       */
      res.send(
        `Try with other URL, This short Url already exits: s.u/${customurl}`
      )
    }
  })
})

/** *********************Utility Functions *******************/
server.listen(8000, (e) => {})

/**
 * Function to generate the random string of 5 characters from a set of preselected 62 characters
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
    characters.charAt(Math.floor(Math.random() * charactersLength))
  return result
}

/**
 * Function to generate the random string of 11 characters from a set of preselected 62 characters
 */
function makeAPIKey (/* length = 5 */) {
  let result = ''
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  for (let i = 0; i < 11; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

/**
 * Function to empty half the cache when its size exceeds 3M
 */
function halfMyCacheMap () {
  if (myCacheMap.size > 3000000) {
    let cnt = 0
    for (const [key, value] of myCacheMap.entries()) {
      myMap.delete(key)
      cnt++
      if (cnt >= 1500000) break
    }
  }
}
