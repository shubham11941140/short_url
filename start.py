'''

def call(r, c):
	a = '..' + '+-' * (c - 1) + '+'
	b = '..' + '|.' * (c - 1) + '|'
	x = '+-' * c + '+'
	y = '|.' * c + '|'
	print(a)
	print(b)
	for _ in range(r - 1):
		print(x)
		print(y)
	print(x)

def print3d(a):
    f = 0
    ans = []
    for j in range(4):
        m = min([a[i][j] for i in range(3)])
        if f == 10 ** 6:
            ans.append(0)
            continue
        if f + m <= 10 ** 6:
            f += m
            ans.append(m)
        else:
            val = 10 ** 6 - f
            f = 10 ** 6
            ans.append(val)
    return ans if f >= 10 ** 6 else []

def sub(n, a):
    sa = sorted(a)
    k = 1
    for i in range(n):
        if k <= sa[i]:
            k += 1
    return k - 1

def double_or_one_thing(s):
    n = len(s)
    i = 0
    ans = ""
    while i < n - 1:
        for j in range(i + 1, n):
            if s[j] != s[i]:
                break
        ans += ''.join([(s[i] + s[i]) for _ in range(i, j)]) if s[j] > s[i] else ''.join([s[i] for _ in range(i, j)])
        i = j
    if i != n:
        ans += s[i]
    return ans

def equal_sum():
    for k in range(int(input())):
        n = int(input())
        val = 1
        val1 = 3
        a = []
        for i in range(n):
            if i <= 29:
                a.append(val)
                val *= 2
            else:
                a.append(val1)
                val1 += 2
        print(*a)
        b = list(map(int, input().split()))
        v = sorted(a + b)
        s = sum(v) // 2
        ans = []
        for i in reversed(range(len(v))):
            if s >= v[i]:
                s -= v[i]
                ans.append(v[i])
        print(*ans)

def weight_lifting(e, w, a):

    LIM = 120
    minval = [[[0 for _ in range(LIM + 1)] for _ in range(LIM + 1)] for _ in range(LIM + 1)]
    cost = [[0 for _ in range(LIM + 1)] for _ in range(LIM + 1)]
    dp = [[0 for _ in range(LIM + 1)] for _ in range(LIM + 1)]

    for k in range(w):
        for i in range(e):
            minval[k][i][i] = a[i][k]
            for j in range(i + 1, e):
                minval[k][i][j] = min(minval[k][i][j - 1], a[j][k])

    for i in range(e):
        for j in range(i, e):
            cost[i][j] = sum([minval[k][i][j] for k in range(w)])

    for length in range(1, e + 1):
        for left in range(e - length + 1):
            right = left + length - 1
            if length == 1:x
                dp[left][right] = cost[left][right] * 2
            else:
                dp[left][right] = min([dp[left][middle] + dp[middle + 1][right] - (2 * cost[left][right]) for middle in range(left, right)])
    return dp[0][e - 1]

for k in range(int(input())):
    e, w = map(int, input().split())
    a = [list(map(int, input().split())) for i in range(e)]
    print("Case #{}: {}".format(k + 1, weight_lifting(e, w, a)))

'''


import time
st = time.time()
import boto3
client = boto3.client(
    'dynamodb',
    aws_access_key_id="H^mThBsB'!s|{=g",
    aws_secret_access_key="AKIAYH32YDAQJVYVN6ER",
    )
dynamodb = boto3.resource(
    'dynamodb',
    aws_access_key_id="H^mThBsB'!s|{=g",
    aws_secret_access_key="AKIAYH32YDAQJVYVN6ER",
    )



from boto3.dynamodb import table



dynamodb = boto3.resource('dynamodb')
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







