import requests

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
        #print(c, i)
        su = str(c) + '_' + str(i)
        # Write a post request http

        # data = '{{"long_url":"https://leetcode.com/problems/copy-list-with-random-pointer/", "short_url":"{0}", "exp_date":31}}'.format(su)


        data = '{{"customurldata":"{0}", "longurldata":"{1}", "ttl":"{2}"}}'.format(su, website, livetime)
        response = requests.post(route, headers=headers, data=data)

        #response = requests.post(route, headers=headers, data=data)
        # route = path + '/createshorten/{0}'.format(key)
        # data = '{{"urldata":"{0}"}}'.format(row[1])
        # response = requests.post(route, headers=headers, data=data)
        print(response.text)