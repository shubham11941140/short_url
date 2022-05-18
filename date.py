from mysql.connector import connect
from random import randint

#establishing the connection
conn = connect(
   user = 'admin',
   password='shubhamgupta1',
   host='database-2.cqztcdymd18c.us-east-1.rds.amazonaws.com',
   database='URL')

#Creating a cursor object using the cursor() method
cursor = conn.cursor()

# Preparing SQL query to INSERT a record into the database.
for i in range(1, 16):

    r = randint(1, 1000)
    w = randint(1, 1000)

    sql = """INSERT INTO readwritecount(readcount, writecount) VALUES (%s, %s)"""
    red = (r, w)

    cursor.execute(sql, red)
    conn.commit()
