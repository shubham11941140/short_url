while :
do
	curl -d '{ "shorturl": "cs559" }' -H "Content-Type: application/json" -X POST http://fault-tolerance-eb-short-url-dev.us-east-1.elasticbeanstalk.com/api/readshorten/CSD1234 &
done
