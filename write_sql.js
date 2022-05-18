// Generate a random number between 1 and 1000 following Pareto distribution
import http from 'k6/http';
import { check } from 'k6';

export const options = {
    scenarios: {
        constant_request_rate: {
            executor: 'constant-arrival-rate',
            rate: 200,
            timeUnit: '1s',
            duration: '5m',
            preAllocatedVUs: 100,
            maxVUs: 20000,
        },
    },
};

// Function to generate a random number between 50 and 100
function getRandomInt(n) {
    return Math.floor(Math.random() * n) + 50;
}

// Function to generate a random string of random length
function getRandomString(n) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < n; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

export default function() {
    var short = getRandomString(getRandomInt(1));

    const pre = "https://github.com/shubham11941140/short_url/";

    const url = 'http://testingcache.eba-kyntw523.us-east-1.elasticbeanstalk.com/api/readshorten/CSD1234';

    const payload = JSON.stringify({
        urldata: pre + short,
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    // send a HTTP POST request
    const res = http.post(url, payload, params);
    console.log(res.body);
}