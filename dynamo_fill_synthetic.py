from csv import DictWriter
from time import time

from boto3 import client, resource

st = time()

client = client(
    "dynamodb",
    region_name="us-east-1",
    aws_access_key_id="H^mThBsB'!s|{=g",
    aws_secret_access_key="AKIAYH32YDAQJVYVN6ER",
)

dynamodb = resource(
    "dynamodb",
    region_name="us-east-1",
    aws_access_key_id="H^mThBsB'!s|{=g",
    aws_secret_access_key="AKIAYH32YDAQJVYVN6ER",
)


def fill():

    table = dynamodb.Table("gupta")

    for i in range(1, 1000 + 1):

        items = [{
            "long_url":
            "https://stackoverflow.com/questions/43689238/boto3" + str(i) +
            "_" + str(j),
            "short_url":
            "ccc" + str(i) + "_" + str(j),
        } for j in range(1, 1000 + 1)]

        with table.batch_writer() as batch:

            for r in items:

                batch.put_item(Item=r)


def csv_writer():

    # Write values to a CSV file
    with open("dynamo.csv", "w") as csvfile:

        writer = DictWriter(csvfile, fieldnames=["long_url", "short_url"])

        writer.writeheader()

        for i in range(1, 10000 + 1):
            for j in range(1, 1000 + 1):

                writer.writerow({
                    "long_url":
                    "https://stackoverflow.com/questions/43689238/boto3" +
                    str(i) + "_" + str(j),
                    "short_url":
                    "aaa" + str(i) + "_" + str(j),
                })


def scan_table():

    print("Scanning table")

    for i in dynamodb.Table("arkurl").scan()["Items"]:

        print(i)


fill()

et = time()

print("Time taken in seconds:", et - st)
