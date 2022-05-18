from requests import post
from sys import argv
from time import time

start_time = time()

headers = {
    'Content-type': 'application/json',
}

# :apikey is a variable for store the key value

func = int(argv[1])
key = argv[2]
website = argv[3]

path = "http://fault-tolerance-eb-short-url-dev.us-east-1.elasticbeanstalk.com/api"

# To Read
if func == 1:
    for i in range(1, int(argv[4]) + 1):
        post(path + '/readshorten/{0}'.format(key), headers = headers, data = '{{"shorturl":"{0}"}}'.format(website))

# To Delete
if func == 2:
    post(path + '/deleteurl/{0}'.format(key), headers = headers, data='{{"shorturl":"{0}"}}'.format(website))

# To Shorten
if func == 3:
    for i in range(1, int(argv[4]) + 1):
        post(path + '/createshorten/{0}'.format(key), headers = headers, data = '{{"urldata":"{0}"}}'.format(website))

# To Create Custom
if func == 4:
    data = '{{"customurldata":"{0}", "longurldata":"{1}", "ttl":"{2}"}}'.format(argv[4], website, int(argv[5]))
    post(path + '/createcustomshorten/{0}'.format(key), headers = headers, data = data)

end_time = time()

print("EXECUTION TIME", end_time - start_time)
