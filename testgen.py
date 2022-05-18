# Connect to MySQL Database
from time import time
from mysql.connector import connect
from csv import writer, QUOTE_MINIMAL

st = time()

# MySQL Database Connection
db = connect(
    host="aa10f4pikqa37be.ci44ziqzvjp1.us-east-1.rds.amazonaws.com",
    user="shubham1194",
    passwd="shubhamgupta",
    database="URL"
)

# Get cursor
my_cursor = db.cursor()

# Execute SQL query
my_cursor.execute("SELECT url, shortenedurl FROM urlMap")

# Store SQL Query result in array
result = my_cursor.fetchall()

a = [str(c) + '_' + str(i) for c in range(1000) for i in range(1000)]

with open('pmap.csv', 'w') as csvfile:

    c = 0

    for row in result:

        # Write row to CSV file
        if "_" in row[1] and 'c' not in row[1]:

            c += 1

            writer = writer(csvfile, delimiter = ',', quotechar = '"', quoting = QUOTE_MINIMAL)

            writer.writerow([c, row[1], row[0]])

print("Time taken:", time() - st)
