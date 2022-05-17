// Generate a random number between 1 and 1000 following Pareto distribution
//   // var random = Math.floor(Math.random() * 1000) + 1;
//   // console.log(random);


import http from 'k6/http';
import { check } from 'k6';


// var data = JSON.parse(open('top1m.json'))
const data = JSON.parse(open('shortlong.json'))
var n = data.length;

// Open a txt file
const seeds = open('seeds.txt');
console.log("Generating random seeds");
// console.log(seeds);
var n1 = seeds.length;

/*
export function setup() {

    // const res = http.get('https://httpbin.org/get');
    return data;
}
*/

// Discrete Sampling
// var data = JSON.parse(open('millionurl.json'))


// Function to generate a discrete random number
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);

    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

function getRandomIntInclusivePareto(min, max, alpha = 1.0) {
    var probabilities = []; // probabilities
    for (var k = min; k <= max; ++k) {
        probabilities.push(1.0/Math.pow(k, alpha)); // computed according to Paretto
    }                                               // would be normalized by SJS

    return getRandomIntInclusive(min, max, probabilities);
    var disc = SJS.Discrete(probabilities); // discrete sampler, returns value in the [0...probabilities.length-1] range
    q = disc.draw() + min; // back to [min...max] interval

    return q;
}


// Function to return a random number between 1 and n
function getRandomInt(n) {
    return Math.floor(Math.random() * n) + 1;
}

export default function ()
{
    // Get value from python file

    // Generate a number that obeys pareto distribution

    var t = getRandomInt(n1 - 1);
    var idx = seeds[t];

    console.log(t);
    console.log(idx);

    if (0 <= n < idx)
    {
        console.log("Error");
    }

    var short = data[idx]["URL"];
    // var lurl = "https://www.google.com/search?q=";
    console.log(short);
    /*

    const url = "http://url-shortener4-dev.ap-south-1.elasticbeanstalk.com/";
    const payload = JSON.stringify({
    long_url: lurl,
    short_url: "",
    exp_date: 31,
    });

    const params = {
    headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhbnkiLCJleHAiOjE2NDk2NTg0NjYsImlzcyI6ImF1dGgtYXBwIiwic3ViIjoiY3M1NTkifQ._JshleXML9zqsV4sDAtaoBhxKPldyE2MPw_2Fo8XjGw',
        'Content-Type': 'application/json',
    },
    };

    // send a HTTP POST request

    const res = http.post(url, payload, params);
    console.log(res.body);
    */

}

/*

curl http://url-shortener4-dev.ap-south-1.elasticbeanstalk.com/ --include --header "Content-Type: application/json" --request "POST" --data
'{"long_url": "https://www.linkedin.com", "short_url": "", "exp_date": 31}' -H "Authorization: Bearer
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhbnkiLCJleHAiOjE2NDk2NTg0NjYsImlzcyI6ImF1dGgtYXBwIiwic3ViIjoiY3M1NTkifQ._JshleXML9zqsV4sDAtaoBhxKPldyE2MPw_2Fo8XjGw"
*/

