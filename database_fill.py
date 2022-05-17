
import csv
import requests
from concurrent.futures import ThreadPoolExecutor, as_completed
import time
start_time = time.time()

path = "http://fault-tolerance-eb-short-url-dev.us-east-1.elasticbeanstalk.com/api"
key = "CSD1234"
headers = {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhbnkiLCJleHAiOjE2NDk2NTg0NjYsImlzcyI6ImF1dGgtYXBwIiwic3ViIjoiY3M1NTkifQ._JshleXML9zqsV4sDAtaoBhxKPldyE2MPw_2Fo8XjGw',
    'Content-type': 'application/json',
}
route = "http://url-shortener4-dev.ap-south-1.elasticbeanstalk.com/"

'''
# Read from CSV file
with open('URL Classification.csv', 'r') as csvfile:
    reader = csv.reader(csvfile)
    c = 1
    for row in reader:
        c += 1
        if c % 1000 == 0:
            print(c)

        if c == 1000:
            break
        #break
        route = path + '/createshorten/{0}'.format(key)
        data = '{{"urldata":"{0}"}}'.format(row[1])
        #for i in range(1, count + 1):

        print("CURL REQUEST:", c, "FOR WEBSITE", row[1], "GIVES RESPONSE:", response.text)
    print(c)
'''

def download_file(route, headers, data):
    while True:
        try:
            response = requests.post(route, headers=headers, data=data)
            # open(f'{file_name}.json', 'wb').write(html.content)
            return response.text
        except requests.exceptions.RequestException as e:
            print(e)
            #return e

def runner():
    threads= []
    with ThreadPoolExecutor(max_workers=5) as executor:
            for c in range(1000):
                for i in range(1000):
                    #print(c, i)
                    su = str(c) + '_' + str(i)
                    # Write a post request http
                    print(su)

                    data = '{{"long_url":"https://leetcode.com/problems/copy-list-with-random-pointer/", "short_url":"{0}", "exp_date":31}}'.format(su)
                    #response = requests.post(route, headers=headers, data=data)

                    threads.append(executor.submit(download_file, route, headers, data))

            for task in as_completed(threads):
                print(task.result())
runner()
end = time.time()
print("EXECUTION TIME", end - start_time)
