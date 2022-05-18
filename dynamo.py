from time import time
from boto3 import client, resource

st = time()

client = client(
    'dynamodb',
    region_name='us-east-1',
    aws_access_key_id="H^mThBsB'!s|{=g",
    aws_secret_access_key="AKIAYH32YDAQJVYVN6ER",
    )

dynamodb = resource(
    'dynamodb',
    region_name='us-east-1',
    aws_access_key_id="H^mThBsB'!s|{=g",
    aws_secret_access_key="AKIAYH32YDAQJVYVN6ER",
    )

def fill():

    table = dynamodb.Table('gupta')

    for i in range(1, 1000 + 1):

        items = [{'long_url': 'https://stackoverflow.com/questions/43689238/boto3' + str(i) + '_' + str(j), 'short_url': 'ccc' + str(i) + '_' + str(j)} for j in range(1, 1000 + 1)]

        with table.batch_writer() as batch:

            for r in items:

                batch.put_item(Item = r)

fill()

et = time()

print("Time taken in seconds:", et - st)
