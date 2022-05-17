# Connect to MySQL Database
from time import time
import mysql.connector
import random
import string
import csv
import time
st = time.time()

# MySQL Database Connection
mydb = mysql.connector.connect(
    host="aa10f4pikqa37be.ci44ziqzvjp1.us-east-1.rds.amazonaws.com",
    user="shubham1194",
    passwd="shubhamgupta",
    database="URL"
)


# Open a new csv file


# Get cursor
mycursor = mydb.cursor()

# Execute SQL query
mycursor.execute("SELECT url, shortenedurl FROM urlMap")
# Store SQL Query result in array
myresult = mycursor.fetchall()
# print(myresult)


a = []
for c in range(1000):
    for i in range(1000):
        f = str(c) + '_' + str(i)
        a.append(f)

with open('pmap.csv', 'w') as csvfile:
    c = 0
    for row in myresult:
        # c += 1
        #print(row)
        # Write row to CSV file
        if "_" in row[1] and 'c' not in row[1]:
            print(row[1])
            c += 1
            if c % 1000 == 0:
                print(c)
            writer = csv.writer(csvfile, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
            writer.writerow([c, row[1], row[0]])
    print(c)
print("Time taken:", time.time() - st)

    # write to CSV file

for i in range(1000):
    f = str(i)
    a.append(f)



'''

# gdrive_2.1.1_linux_386.tar.gz
# Unzip tar.gz in linux
# tar -xvf gdrive_2.1.1_linux_386.tar.gz

# ./gdrive upload allurl.csv

# https://drive.google.com/file/d/1iVNC1VZveylakmxaqe3xCdZ_l_Hrj7iN/view?usp=sharing

https://drive.google.com/file/d/1iVNC1VZveylakmxaqe3xCdZ_l_Hrj7iN/view?usp=sharing

wget --no-check-certificate 'https://docs.google.com/uc?export=download&id=1iVNC1VZveylakmxaqe3xCdZ_l_Hrj7iN' -O 'my.csv'

curl -L 'https://docs.google.com/uc?export=download&id=1iVNC1VZveylakmxaqe3xCdZ_l_Hrj7iN' -o sampleoutput.csv

https://drive.google.com/file/d/1iVNC1VZveylakmxaqe3xCdZ_l_Hrj7iN/view?usp=sharing

gdown https://drive.google.com/uc?id=1iVNC1VZveylakmxaqe3xCdZ_l_Hrj7iN -O my.csv

https://drive.google.com/file/d/1un1c1PM_YAYkCLgwbbJTz_-P3EzqowVq/view?usp=sharing


gdown https://drive.google.com/uc?id=1un1c1PM_YAYkCLgwbbJTz_-P3EzqowVq -O my.csv

'''

# Single line command to check the size of a CSV file
# wc -l allurl.csv
