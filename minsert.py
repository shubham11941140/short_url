# importing Mongoclient from pymongo
from pymongo import MongoClient

# database
db = MongoClient("mongodb://localhost:27017/")["GFG"]

# Created or Switched to collection
collection = db["Student"]

# Creating a list of records which we
# insert in the collection using the
# update_many() method.

for i in range(1000):

    collection.insert_many([{ 'shorturl': str(i) + "_" + str(j),'longurl': "https://www.google.com/" + str(j) + "_" + str(i) } for j in range(1, 1000)])


# In the above list _id field is provided so it inserted in
# the collection as specified.

# Inserting the entire list in the collection
