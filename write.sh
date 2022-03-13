#!/bin/bash
i=0
longUrl = "https://www.google.com/"
baseUrl = "http://url-shortener4-dev.ap-south-1.elasticbeanstalk.com/"
while [ $i -lt 500 ]
do
    j=0
    while [ $j -lt 1000 ]
    do
        shortUrl=$i"_"$j
        echo shortUrl
        curl http://url-shortener4-dev.ap-south-1.elasticbeanstalk.com/ --include --header "Content-Type: application/json" --request "POST" --data '{"long_url": "https://www.google.com/", "short_url": "'${shortUrl}'", "exp_date": 31}' -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhbnkiLCJleHAiOjE2NDk2NTg0NjYsImlzcyI6ImF1dGgtYXBwIiwic3ViIjoiY3M1NTkifQ._JshleXML9zqsV4sDAtaoBhxKPldyE2MPw_2Fo8XjGw"
        j=$((j+1))
    done
    i=$((i+1))
done
