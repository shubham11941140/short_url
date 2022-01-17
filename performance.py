import requests
import sys
import time

start_time = time.time()

headers = {
    'Content-type': 'application/json',
}


# :apikey is a variable for store the key value

func = int(sys.argv[1])
key = sys.argv[2]
website = sys.argv[3]

if func == 1: # To Read
    count = int(sys.argv[4])
    route = 'http://ec2-54-173-198-224.compute-1.amazonaws.com:7000/api/readshorten/{0}'.format(key)
    data = '{{"shorturl":"{0}"}}'.format(website)
    for i in range(1, count + 1):
        response = requests.post(route, headers=headers, data=data)
        print("CURL REQUEST:", i, "GIVES RESPONSE:", response.text)

if func == 2: # To Delete
    route = 'http://ec2-54-173-198-224.compute-1.amazonaws.com:7000/api/deleteurl/{0}'.format(key)
    data = '{{"shorturl":"{0}"}}'.format(website)
    response = requests.post(route, headers=headers, data=data)
    print("RESPONSE IS:", response.text)

if func == 3: # To Shorten
    count = int(sys.argv[4])
    route = 'http://ec2-54-173-198-224.compute-1.amazonaws.com:7000/api/createshorten/{0}'.format(key)
    data = '{{"urldata":"{0}"}}'.format(website)
    for i in range(1, count + 1):
        response = requests.post(route, headers=headers, data=data)
        print("CURL REQUEST:", i, "GIVES RESPONSE:", response.text)

if func == 4: # To Create Custom
    custom = sys.argv[4]
    livetime = int(sys.argv[5])
    route = 'http://ec2-54-173-198-224.compute-1.amazonaws.com:7000/api/createcustomshorten/{0}'.format(key)
    data = '{{"customurldata":"{0}", "longurldata":"{1}", "ttl":"{2}"}}'.format(custom, website, livetime)
    response = requests.post(route, headers=headers, data=data)
    print("RESPONSE IS:", response.text)

end_time = time.time()
print("EXECUTION TIME", end_time - start_time)

'''
# To read

//Read
route:-  '/api/readshorten/:apiKey'
data:-    {shorturl: "ahort LINK of which we want full long URL "}


# To Delete
route:-  '/api/deleteurl/:apiKey'
data:-    {shorturl: "short LINK of which we want to delete DB entry and have access of that link "}

# To Shorten
route:-  '/api/createshorten/:apiKey'
data:-    {urldata: "LINK_TO shoten"}

# To Create Custom
route:-  '/api/createcustomshorten/:apiKey'
data:-    {customurldataa: "custom short LINK of which we want link",
           longurldata: "LINK_TO shoten",
            ttl: "Time to live in number of days"}


website = sys.argv[1]
count = int(sys.argv[2])

data = '{{"url":"{0}"}}'.format(website)

for i in range(1, count + 1):
    print("CURL API REQUEST:", i)
    response = requests.post('http://ec2-54-173-198-224.compute-1.amazonaws.com:3000/api/createcustomshorten/:apiKey', headers=headers, data=data)

'''