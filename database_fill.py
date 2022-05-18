
from csv import reader
from requests import post
from requests.exceptions import RequestException
from concurrent.futures import ThreadPoolExecutor, as_completed
from time import time

start_time = time()

path = "http://fault-tolerance-eb-short-url-dev.us-east-1.elasticbeanstalk.com/api"
key = "CSD1234"

headers = {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhbnkiLCJleHAiOjE2NDk2NTg0NjYsImlzcyI6ImF1dGgtYXBwIiwic3ViIjoiY3M1NTkifQ._JshleXML9zqsV4sDAtaoBhxKPldyE2MPw_2Fo8XjGw',
    'Content-type': 'application/json',
}

route = "http://url-shortener4-dev.ap-south-1.elasticbeanstalk.com/"

def read_csv():

    # Read from CSV file
    with open('URL Classification.csv', 'r') as csvfile:

        reader = reader(csvfile)

        for row in reader:

            route = path + '/createshorten/{0}'.format(key)
            data = '{{"urldata":"{0}"}}'.format(row[1])

            print(route, data)


def download_file(route, headers, data):

    while True:

        try:
            return post(route, headers = headers, data = data).text

        except RequestException as e:
            print(e)

def runner():

    threads = []

    with ThreadPoolExecutor(max_workers = 5) as executor:

            for c in range(1000):
                for i in range(1000):

                    su = str(c) + '_' + str(i)

                    # Write a post request http

                    data = '{{"long_url":"https://leetcode.com/problems/copy-list-with-random-pointer/", "short_url":"{0}", "exp_date":31}}'.format(su)

                    threads.append(executor.submit(download_file, route, headers, data))

            for task in as_completed(threads):

                print(task.result())

runner()

end = time()
print("EXECUTION TIME", end - start_time)
