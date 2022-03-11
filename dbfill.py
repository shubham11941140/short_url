
import csv
import requests
from concurrent.futures import ThreadPoolExecutor, as_completed
import time
start_time = time.time()

path = "http://fault-tolerance-eb-short-url-dev.us-east-1.elasticbeanstalk.com/api"
key = "CSD1234"
headers = {
    'Content-type': 'application/json',
}

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
    try:
        response = requests.post(route, headers=headers, data=data)
        # open(f'{file_name}.json', 'wb').write(html.content)
        return response.text
    except requests.exceptions.RequestException as e:
       return e

def runner():
    threads= []
    with open('allurl.csv', 'r') as csvfile:
        reader = csv.reader(csvfile)
        c = 1
        with ThreadPoolExecutor(max_workers=20) as executor:
            for row in reader:
                c += 1
                #print(c)
                if c % 10000 == 0:
                    print(c)
                    break
                route = path + '/createshorten/{0}'.format(key)
                data = '{{"urldata":"{0}"}}'.format(row[1])
                threads.append(executor.submit(download_file, route, headers, data))

            for task in as_completed(threads):
                print(task.result())
runner()
end = time.time()
print("EXECUTION TIME", end - start_time)
