import time
st = time.time()
import boto3
client = boto3.client(
    'dynamodb',
    region_name='us-east-1',
    aws_access_key_id="H^mThBsB'!s|{=g",
    aws_secret_access_key="AKIAYH32YDAQJVYVN6ER",
    )
dynamodb = boto3.resource(
    'dynamodb',
    region_name='us-east-1',
    aws_access_key_id="H^mThBsB'!s|{=g",
    aws_secret_access_key="AKIAYH32YDAQJVYVN6ER",
    )



from boto3.dynamodb import table



# dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('gupta')
print(table.creation_date_time)

items = []
N = 100
for i in range(1, 1000 + 1):
    items = []
    for j in range(1, 1000 + 1):
        items.append({'long_url': 'https://stackoverflow.com/questions/43689238/boto3' + str(i) + '_' + str(j), 'short_url': 'ccc' + str(i) + '_' + str(j)})
    print(i)
    with table.batch_writer() as batch:
        for r in items:
            batch.put_item(Item=r)
            # print("Inserted item: {}".format(r))


et = time.time()
print("Time taken in seconds:", et - st)



'''

print("Scanning table")
response = dynamodb.Table('arkurl').scan()
for i in response['Items']:
    print(i)

'''