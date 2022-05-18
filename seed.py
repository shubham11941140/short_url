from random import paretovariate
from csv import reader, writer, QUOTE_MINIMAL
from sys import argv, stdout

# Generate a random number between 1 and 1000 following Pareto distribution
def gen_pareto(n):
    return int(n * paretovariate(1.5))

# Read a particular row from a csv file
def read_row(file_name, row_num):

    with open(file_name, 'r') as csvfile:

        reader = reader(csvfile)

        c = 1

        for row in reader:

            c += 1

            if c == row_num:

                return row

# Get number of rows in CSV file
def get_num_rows(file_name):

    with open(file_name, 'r') as csvfile:

        return len([1 for _ in reader(csvfile)])

# Write the first 1000 rows to a new CSV file
def write_first_1000_rows(file_name):

    with open(file_name, 'r') as csvfile:

        reader = reader(csvfile)

        c = 0

        with open('first_1000000_rows.csv', 'w') as csvfile:

            writer = writer(csvfile, delimiter=',', quotechar = '"', quoting = QUOTE_MINIMAL)

            writer.writerow(['Number', 'URL'])

            for row in reader:

                c += 1

                writer.writerow([c, row[1]])

# Set stdout to seeds.txt
stdout = open('seeds.txt', 'w')

for _ in range(int(argv[1])):
    print(gen_pareto(10 ** 5), file = stdout)
