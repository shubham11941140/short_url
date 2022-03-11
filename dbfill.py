
import csv
import requests

path = "http://fault-tolerance-eb-short-url-dev.us-east-1.elasticbeanstalk.com/api"
key = "CSD1234"
headers = {
    'Content-type': 'application/json',
}

# Read from CSV file
with open('URL Classification.csv', 'r') as csvfile:
    reader = csv.reader(csvfile)
    c = 1
    for row in reader:
        c += 1
        if c == 10:
            break
        #break
        route = path + '/createshorten/{0}'.format(key)
        data = '{{"urldata":"{0}"}}'.format(row[1])
        #for i in range(1, count + 1):
        response = requests.post(route, headers=headers, data=data)
        print("CURL REQUEST:", c, "FOR WEBSITE", row[1], "GIVES RESPONSE:", response.text)
