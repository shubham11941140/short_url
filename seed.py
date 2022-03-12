import random
import csv
import sys

# Generate a random number between 1 and 1000 following Pareto distribution
def gen_pareto(n):
    return int(n * random.paretovariate(1.5))

# Read a particular row from a csv file
def read_row(file_name, row_num):
    with open(file_name, 'r') as csvfile:
        reader = csv.reader(csvfile)
        c = 1
        for row in reader:
            c += 1
            if c == row_num:
                return row

# Get number of rows in CSV file
def get_num_rows(file_name):
    with open(file_name, 'r') as csvfile:
        reader = csv.reader(csvfile)
        c = 0
        for row in reader:
            c += 1
            if c % 10000 == 0:
                print(c)

        return c

# Write the first 1000 rows to a new CSV file
def write_first_1000_rows(file_name):
    with open(file_name, 'r') as csvfile:
        reader = csv.reader(csvfile)
        c = 0
        with open('first_1000000_rows.csv', 'w') as csvfile:
            writer = csv.writer(csvfile, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
            writer.writerow(['Number', 'URL'])
            for row in reader:
                c += 1
                if c % 10000 == 0:
                    print(c)
                if c > 10 ** 6:
                    break
                writer.writerow([c, row[1]])


# Set stdout to seeds.txt
sys.stdout = open('seeds.txt', 'w')

n = int(sys.argv[1])
for _ in range(n):
    k = 10 ** 5
    r = gen_pareto(k)
    print(r)


