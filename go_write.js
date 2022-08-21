// Generate a random number between 1 and 1000 following Pareto distribution
import http from 'k6/http'
import { check } from 'k6'

const data = JSON.parse(open('short_long.json'))
const n = data.length

// Open a txt file
const seeds = open('seeds.txt')

const n1 = seeds.length

// Function to generate a discrete random number
function getRandomIntInclusive (min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min // The maximum is inclusive and the minimum is inclusive
}

function getRandomIntInclusivePareto (min, max, alpha = 1.0) {
  const probabilities = [] // probabilities
  for (let k = min; k <= max; ++k) {
    probabilities.push(1.0 / Math.pow(k, alpha)) // computed according to Pareto
  } // would be normalized by SJS

  return getRandomIntInclusive(min, max, probabilities)
}

// Function to return a random number between 1 and n
function getRandomInt (n) {
  return Math.floor(Math.random() * n) + 1
}

export default function () {
  // Generate a number that obeys pareto distribution
  const t = getRandomInt(n1 - 1)
  const idx = seeds[t]

  if (n >= 0 < idx) {
  }

  const short = data[idx].URL
}
