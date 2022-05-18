// Generate a random number between 1 and 1000 following Pareto distribution
import http from 'k6/http';
import { check } from 'k6';

const data = JSON.parse(open('million_url.json'))
var n = data.length;

// Open a txt file
const seeds = open('seeds.txt');
console.log("Generating random seeds");

var n1 = seeds.length;

// Function to generate a discrete random number
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

function getRandomIntInclusivePareto(min, max, alpha = 1.0) {
    var probabilities = []; // probabilities
    for (var k = min; k <= max; ++k) {
        probabilities.push(1.0 / Math.pow(k, alpha)); // computed according to Pareto
    } // would be normalized by SJS

    return getRandomIntInclusive(min, max, probabilities);
}

// Function to return a random number between 1 and n
function getRandomInt(n) {
    return Math.floor(Math.random() * n) + 1;
}

export default function() {

    // Generate a number that obeys pareto distribution
    var t = getRandomInt(n1);
    var idx = seeds.indexOf(t);

    console.log(t);
    console.log(idx);

    if (n <= idx) {
        console.log("Error");
    }

    var lurl = data[idx]["URL"];

    const url = 'http://fault-tolerance-eb-short-url-dev.us-east-1.elasticbeanstalk.com/api/createshorten/CSD1234';
    const payload = JSON.stringify({
        urldata: lurl
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    // send a HTTP POST request
    const res = http.post(url, payload, params);
}