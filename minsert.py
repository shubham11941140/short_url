# importing Mongoclient from pymongo
from pymongo import MongoClient


myclient = MongoClient("mongodb://localhost:27017/")

# database
db = myclient["GFG"]

# Created or Switched to collection
# names: GeeksForGeeks
collection = db["Student"]

# Creating a list of records which we
# insert in the collection using the
# update_many() method.

for i in range(1000):
    mylist = []
    for j in range(1000):
        url = "https://www.google.com/" + str(j) + "_" + str(j)
        custom = str(i) + "_" + str(j)
        f = { 'shorturl': custom,'longurl': url }
        mylist.append(f)
    print(i)
    collection.insert_many(mylist)


# In the above list _id field is provided so it inserted in
# the collection as specified.

# Inserting the entire list in the collection
