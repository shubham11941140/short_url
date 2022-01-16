# from distutils.log import error
import mysql.connector

from random import randint #,  im port randint

#establishing the connection
conn = mysql.connector.connect(
   user='root', password='lavishg@2206', host='127.0.0.1', database='URL')

#Creating a cursor object using the cursor() method
cursor = conn.cursor()

# Preparing SQL query to INSERT a record into the database.
print(13)

for i in range(1, 16):
    #d = "CURDATE() - INTERVAL {} DAY".format(i)
    r = randint(1, 1000)
    w = randint(1, 1000)
    sql = """INSERT INTO readwritecount(readcount, writecount) VALUES (%s, %s)"""
    #try:sudo 
    red = (r, w)
    cursor.execute(sql, red)
    #except:
        #print("WHY")
        #print(mysql.connector.error)
    conn.commit()