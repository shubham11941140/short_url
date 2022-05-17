import http from "k6/http";
// import { check } from 'k6';

export var SJS = (function(){

    // Utility functions
    function _sum(a, b) {
	return a + b;
    };
    function _fillArrayWithNumber(size, num) {
	// thanks be to stackOverflow... this is a beautiful one-liner
	return Array.apply(null, Array(size)).map(Number.prototype.valueOf, num);
    };
    function _rangeFunc(upper) {
	var i = 0, out = [];
	while (i < upper) out.push(i++);
	return out;
    };
    // Prototype function
    function _samplerFunction(size) {
	if (!Number.isInteger(size) || size < 0) {
	  throw new Error ("Number of samples must be a non-negative integer.");
	}
	if (!this.draw) {
	    throw new Error ("Distribution must specify a draw function.");
	}
	var result = [];
	while (size--) {
	    result.push(this.draw());
	}
	return result;
    };
    // Prototype for discrete distributions
    var _samplerPrototype = {
	sample: _samplerFunction
    };

    function Bernoulli(p) {

	var result = Object.create(_samplerPrototype);

	result.draw = function() {
	    return (Math.random() < p) ? 1 : 0;
	};

	result.toString = function() {
	    return "Bernoulli( " + p + " )";
	};

	return result;
    }

    function Binomial(n, p) {

	var result = Object.create(_samplerPrototype),
	bern = SJS.Bernoulli(p);

	result.draw = function() {
	    return bern.sample(n).reduce(_sum, 0); // less space efficient than adding a bunch of draws, but cleaner :)
	}

	result.toString = function() { 
	    return "Binom( " + 
		[n, p].join(", ") + 
		" )"; 
	}

	return result;
    }

    function Discrete(probs) { // probs should be an array of probabilities. (they get normalized automagically) //
	
	var result = Object.create(_samplerPrototype),
	k = probs.length;

	result.draw = function() {
	    var i, p;
	    for (i = 0; i < k; i++) {
		p = probs[i] / probs.slice(i).reduce(_sum, 0); // this is the (normalized) head of a slice of probs
		if (Bernoulli(p).draw()) return i;             // using the truthiness of a Bernoulli draw
	    }
	    return k - 1;
	};

	result.sampleNoReplace = function(size) {
	    if (size>probs.length) {
		throw new Error("Sampling without replacement, and the sample size exceeds vector size.")
	    }
	    var disc, index, sum, samp = [];
	    var currentProbs = probs;
	    var live = _rangeFunc(probs.length);
	    while (size--) {
		sum = currentProbs.reduce(_sum, 0);
		currentProbs = currentProbs.map(function(x) {return x/sum; });
		disc = SJS.Discrete(currentProbs);
		index = disc.draw();
		samp.push(live[index]);
		live.splice(index, 1);
		currentProbs.splice(index, 1);
		sum = currentProbs.reduce(_sum, 0);
		currentProbs = currentProbs.map(function(x) {return x/sum; });
	    }
	    currentProbs = probs;
	    live = _rangeFunc(probs.length);
	    return samp;
	}

	result.toString = function() {
	    return "Dicrete( [" + 
		probs.join(", ") + 
		"] )";
	};

	return result;
    }

    function Multinomial(n, probs) {

	var result = Object.create(_samplerPrototype),
	k = probs.length,
	disc = Discrete(probs);

	result.draw = function() {
	    var draw_result = _fillArrayWithNumber(k, 0),
	    i = n;
	    while (i--) {
		draw_result[disc.draw()] += 1;
	    }
	    return draw_result;
	};

	result.toString = function() {
	    return "Multinom( " + 
		n + 
		", [" + probs.join(", ") + 
		"] )";
	};

	return result;
    }

    function NegBinomial(r, p) {
	var result = Object.create(_samplerPrototype);

	result.draw = function() {
	    var draw_result = 0, failures = r;
	    while (failures) {
		Bernoulli(p).draw() ? draw_result++ : failures--;
	    }
	    return draw_result;
	};

	result.toString = function() {
	    return "NegBinomial( " +  r +
		", " + p + " )";
	};

	return result;
    }

    function Poisson(lambda) {
	var result = Object.create(_samplerPrototype);

	result.draw = function() {
	    var draw_result, L = Math.exp(- lambda), k = 0, p = 1;

	    do {
		k++;
		p = p * Math.random()
	    } while (p > L);
	    return k-1;
	}

	result.toString = function() {
	    return "Poisson( " + lambda + " )";
	}

	return result;
    }

    return {
	_fillArrayWithNumber: _fillArrayWithNumber, // REMOVE EVENTUALLY - this is just so the Array.prototype mod can work
	_rangeFunc: _rangeFunc,
	Bernoulli: Bernoulli,
	Binomial: Binomial,
	Discrete: Discrete,
	Multinomial: Multinomial,
	NegBinomial: NegBinomial,
	Poisson: Poisson
    };
})();

//*** Sampling from arrays ***//
// Eventually merge into SJS ???
function sample_from_array(array, numSamples, withReplacement) {
    var n = numSamples || 1,
    result = [],
    copy,
    disc,
    index;

    if (!withReplacement && numSamples > array.length) {
	throw new Error("Sampling without replacement, and the sample size exceeds vector size.")
    }

    if (withReplacement) {
	while(numSamples--) {
	    disc = SJS.Discrete(SJS._fillArrayWithNumber(array.length, 1));
	    result.push(array[disc.draw()]);
	}
    } else {
	// instead of splicing, consider sampling from an array of possible indices? meh?
	copy = array.slice(0);
	while (numSamples--) {
	    disc = SJS.Discrete(SJS._fillArrayWithNumber(copy.length, 1));
	    index = disc.draw();
	    result.push(copy[index]);
	    copy.splice(index, 1);
	    console.log("array: "+copy);
	}	
    }
    return result;
}
export function getRandomIntInclusivePareto(min, max, alpha = 1.0) {
    var probabilities = []; // probabilities 
    for (var k = min; k <= max; ++k) {
        probabilities.push(1.0/Math.pow(k, alpha)); // computed according to Paretto
    }                                               // would be normalized by SJS

    var disc = SJS.Discrete(probabilities); // discrete sampler, returns value in the [0...probabilities.length-1] range
    let q = disc.draw() + min; // back to [min...max] interval

    return q;
}

// console.log("Testing Paretto");

// var t = getRandomIntInclusivePareto(1, 10, 1.3);

// console.log(t);

export function getPareto(n){
    return getRandomIntInclusivePareto(1,n, 1);
}
function myFunc(n){
    // var map1 = new Map();
    // console.log(`http://url-shortener4-dev.ap-south-1.elasticbeanstalk.com/c${getPareto(100)}_${Math.floor(Math.random()*100)}`);
    for(let i=0;i<n;i++){
        var t = getRandomIntInclusivePareto(1, 1000, 1);
        // console.log(t);
        // map1[t]++;
    }

}

// myFunc(1);

// export const options = {
//     scenarios: {
//       constant_request_rate: {
//         executor: 'constant-arrival-rate',
//         rate: 1000,
//         timeUnit: '1s',
//         duration: '180s',
//         preAllocatedVUs: 1,
//         maxVUs: 1,
//       },
//     },
//     maxRedirects: 0,
// 	// batch: 100,
// 	// discardResponseBodies: true,
//   };


// export default function () {
//     // getPareto(100);
//   const url =
//   [
//       `http://url-shortener4-dev.ap-south-1.elasticbeanstalk.com/c${getPareto(1000)}_${Math.floor(Math.random()*1000)}`,
//   ];
//     // console.log(url);
//   url.forEach(myFunc);
//   function myFunc(url){
//     const res = http.get(url);
//     // console.log(res.body);
//   }
// //   console.log(res.body);
// }


// discrete.js
// Sample from discrete distributions.

// export default function ()
// {
//     // var short = getRandomString(getRandomInt(1));
//     // var lurl = "https://www.google.com/search?q=";
//     // console.log(short);
//     // const pre = "https://github.com/shubham11941140/short_url/";
//     const url = 'http://url-shortener4-dev.ap-south-1.elasticbeanstalk.com/';
//     const payload = JSON.stringify({
//         // urldata: pre + short,
//         // shorturl: `${getPareto(150)}_${Math.floor(Math.random()*999)}`
//         long_url: "https://www.google.com",
//          short_url: `test${getPareto(150)}_${Math.floor(Math.random()*999)}`,
//         // short_url: ,
//           exp_date: 31
//     });
//     // curl    -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhbnkiLCJleHAiOjE2NDk2NTg0NjYsImlzcyI6ImF1dGgtYXBwIiwic3ViIjoiY3M1NTkifQ._JshleXML9zqsV4sDAtaoBhxKPldyE2MPw_2Fo8XjGw"

//         console.log(payload);
//     const params = {
//     headers: {
//         'Content-Type': 'application/json',
//         'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhbnkiLCJleHAiOjE2NDk2NTg0NjYsImlzcyI6ImF1dGgtYXBwIiwic3ViIjoiY3M1NTkifQ._JshleXML9zqsV4sDAtaoBhxKPldyE2MPw_2Fo8XjGw'
//     },
//     };

//     // send a HTTP POST request
//     // console.log(payload);
//     const res = http.post(url, payload, params);
//     // console.log(res.body);
// }

export var t = 0;
export default function ()
{
    // var short = getRandomString(getRandomInt(1));
    // var lurl = "https://www.google.com/search?q=";
    // console.log(short);
    // const pre = "https://github.com/shubham11941140/short_url/";

	if(t===0)
	{
		console.log(Date.now(), 0, 0);
		t=1;
	}

    const url = 'http://testingcache.eba-kyntw523.us-east-1.elasticbeanstalk.com/api/readshorten/CSD1234';
    const payload = JSON.stringify({
        // urldata: pre + short,
        shorturl: `${Math.floor(Math.random()*999)}_${Math.floor(Math.random()*999)}`
    });

    const params = {
    headers: {
        'Content-Type': 'application/json',
    },
    };

    // send a HTTP POST request
    // console.log(payload);
    let res = http.post(url, payload, params);
	let fail = ((res.status === 302)? 0:1);
    console.log(Date.now(), res.timings.duration, fail);
    // console.log(res.body);
}


export const options = {
    duration: '1m',
    // vus: 1,
    maxRedirects: 0,
	// discardResponseBodies: true,
};

// export var t = 0;
// export default function () {
//     // const requests = [];
//     // for(let i=0;i<1000;i++){
//     //     const req1 = {
//     //         method: 'GET',
//     //         url: `http://url-shortener4-dev.ap-south-1.elasticbeanstalk.com/${getPareto(1001)-1}_${Math.floor(Math.random()*999)}`,
//     //     };
//     //     requests.push(req1);
//     // }
//     // const res = http.batch(requests);
// 	if(t===0)
// 	{
// 		console.log(Date.now(), 0, 0);
// 		t=1;
// 	}
//     const res = http.get(`http://url-shortener4-dev.ap-south-1.elasticbeanstalk.com/${Math.floor(Math.random()*999)}_${Math.floor(Math.random()*999)}`);
// 	let fail = ((res.status === 302)? 0:1);
//     console.log(Date.now(), res.timings.duration, fail);
// }