from requests import post

headers = {
    'Content-type': 'application/json',
}

path = "http://fault-tolerance-eb-short-url-dev.us-east-1.elasticbeanstalk.com/api"
key = "CSD1234"
website = "https://leetcode.com/problems/copy-list-with-random-pointer/"
livetime = 100
route = path + '/createcustomshorten/{0}'.format(key)

for c in range(1000):
    for i in range(1000):

        su = str(c) + '_' + str(i)

        # Write a post request http

        data = '{{"customurldata":"{0}", "longurldata":"{1}", "ttl":"{2}"}}'.format(su, website, livetime)
        response = post(route, headers = headers, data = data)

        print(response.text)