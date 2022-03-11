import random
import string
import csv

# Function to generate random length string
def gen_str(n):
    return ''.join(random.choice(string.ascii_letters) for _ in range(n))

# Function to generate random number from length 1-500
def gen_num(n):
    return random.randint(n // 2, n)


# 500 million
n = 500 * 1000000

pre = "https://github.com/shubham11941140/short_url/"


# Open a new CSV file
with open('allurl.csv', 'w') as csvfile:
    writer = csv.writer(csvfile, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
    writer.writerow(['Number', 'URL'])
    for i in range(n):
        if i % 1000 == 0:
            print(i)
        # Generate random string
        str_len = gen_num(100)
        str_val = pre + gen_str(str_len)
        # Write to CSV file
        writer.writerow([i + 1, str_val])


