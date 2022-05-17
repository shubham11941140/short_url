#!/bin/sh
apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
apt-get update
apt-get install k6
rm -rf /UrlShortenerTest
git clone https://github.com/harshv46/UrlShortenerTest.git
cd UrlShortenerTest
k6 run -q mytest_ark.js > testlog.txt
