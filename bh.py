import requests

headers = {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhbnkiLCJleHAiOjE2NDk2NTg0NjYsImlzcyI6ImF1dGgtYXBwIiwic3ViIjoiY3M1NTkifQ._JshleXML9zqsV4sDAtaoBhxKPldyE2MPw_2Fo8XjGw',
    'Content-type': 'application/json',
}

route = "http://url-shortener4-dev.ap-south-1.elasticbeanstalk.com/"

for c in range(1000):
    for i in range(1000):
        #print(c, i)
        su = str(c) + '_' + str(i)
        # Write a post request http

        data = '{{"long_url":"https://leetcode.com/problems/copy-list-with-random-pointer/", "short_url":"{0}", "exp_date":31}}'.format(su)

        response = requests.post(route, headers=headers, data=data)
        # route = path + '/createshorten/{0}'.format(key)
        # data = '{{"urldata":"{0}"}}'.format(row[1])
        # response = requests.post(route, headers=headers, data=data)
        print(response.text)