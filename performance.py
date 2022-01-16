import requests
import sys

headers = {
    'Content-type': 'application/json',
}

website = sys.argv[1]
count = int(sys.argv[2])

data = '{{"url":"{0}"}}'.format(website)

for i in range(1, count + 1):
    print("CURL API REQUEST:", i)
    response = requests.post('http://localhost:3000/data', headers=headers, data=data)