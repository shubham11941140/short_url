import http from 'k6/http'

export var SJS = (function () {
  // Utility functions
  function _sum (a, b) {
    return a + b
  }

  function _fillArrayWithNumber (size, num) {
    return Array.apply(null, Array(size)).map(Number.prototype.valueOf, num)
  }

  function _rangeFunc (upper) {
    let i = 0
    const out = []
    while (i < upper) out.push(i++)
    return out
  }

  // Prototype function
  function _samplerFunction (size) {
    if (!Number.isInteger(size) || size < 0) {
      throw new Error('Number of samples must be a non-negative integer.')
    }
    if (!this.draw) {
      throw new Error('Distribution must specify a draw function.')
    }
    const result = []
    while (size--) {
      result.push(this.draw())
    }
    return result
  }

  // Prototype for discrete distributions
  const _samplerPrototype = {
    sample: _samplerFunction
  }

  function Bernoulli (p) {
    const result = Object.create(_samplerPrototype)

    result.draw = function () {
      return Math.random() < p ? 1 : 0
    }

    result.toString = function () {
      return 'Bernoulli( ' + p + ' )'
    }

    return result
  }

  function Binomial (n, p) {
    const result = Object.create(_samplerPrototype)
    const bern = SJS.Bernoulli(p)

    result.draw = function () {
      return bern.sample(n).reduce(_sum, 0) // less space efficient than adding a bunch of draws, but cleaner :)
    }

    result.toString = function () {
      return 'Binom( ' + [n, p].join(', ') + ' )'
    }

    return result
  }

  function Discrete (probs) {
    // probs should be an array of probabilities. (they get normalized automagically) //

    const result = Object.create(_samplerPrototype)
    const k = probs.length

    result.draw = function () {
      let i, p
      for (i = 0; i < k; i++) {
        p = probs[i] / probs.slice(i).reduce(_sum, 0) // this is the (normalized) head of a slice of probs
        if (Bernoulli(p).draw()) return i // using the truthiness of a Bernoulli draw
      }
      return k - 1
    }

    result.sampleNoReplace = function (size) {
      if (size > probs.length) {
        throw new Error(
          'Sampling without replacement, and the sample size exceeds vector size.'
        )
      }
      let disc
      let index
      let sum
      const samp = []
      let currentProbs = probs
      let live = _rangeFunc(probs.length)
      while (size--) {
        sum = currentProbs.reduce(_sum, 0)
        currentProbs = currentProbs.map(function (x) {
          return x / sum
        })
        disc = SJS.Discrete(currentProbs)
        index = disc.draw()
        samp.push(live[index])
        live.splice(index, 1)
        currentProbs.splice(index, 1)
        sum = currentProbs.reduce(_sum, 0)
        currentProbs = currentProbs.map(function (x) {
          return x / sum
        })
      }
      currentProbs = probs
      live = _rangeFunc(probs.length)
      return samp
    }

    result.toString = function () {
      return 'Dicrete( [' + probs.join(', ') + '] )'
    }

    return result
  }

  function Multinomial (n, probs) {
    const result = Object.create(_samplerPrototype)
    const k = probs.length
    const disc = Discrete(probs)

    result.draw = function () {
      const draw_result = _fillArrayWithNumber(k, 0)
      let i = n
      while (i--) {
        draw_result[disc.draw()] += 1
      }
      return draw_result
    }

    result.toString = function () {
      return 'Multinom( ' + n + ', [' + probs.join(', ') + '] )'
    }

    return result
  }

  function NegBinomial (r, p) {
    const result = Object.create(_samplerPrototype)

    result.draw = function () {
      let draw_result = 0
      let failures = r
      while (failures) {
        Bernoulli(p).draw() ? draw_result++ : failures--
      }
      return draw_result
    }

    result.toString = function () {
      return 'NegBinomial( ' + r + ', ' + p + ' )'
    }

    return result
  }

  function Poisson (lambda) {
    const result = Object.create(_samplerPrototype)

    result.draw = function () {
      let draw_result
      const L = Math.exp(-lambda)
      let k = 0
      let p = 1

      do {
        k++
        p = p * Math.random()
      } while (p > L)
      return k - 1
    }

    result.toString = function () {
      return 'Poisson( ' + lambda + ' )'
    }

    return result
  }

  return {
    _fillArrayWithNumber, // REMOVE EVENTUALLY - this is just so the Array.prototype mod can work
    _rangeFunc,
    Bernoulli,
    Binomial,
    Discrete,
    Multinomial,
    NegBinomial,
    Poisson
  }
})()

//* ** Sampling from arrays ***//
// Eventually merge into SJS ???
function sample_from_array (array, numSamples, withReplacement) {
  const n = numSamples || 1
  const result = []
  let copy
  let disc
  let index

  if (!withReplacement && numSamples > array.length) {
    throw new Error(
      'Sampling without replacement, and the sample size exceeds vector size.'
    )
  }

  if (withReplacement) {
    while (numSamples--) {
      disc = SJS.Discrete(SJS._fillArrayWithNumber(array.length, 1))
      result.push(array[disc.draw()])
    }
  } else {
    // instead of splicing, consider sampling from an array of possible indices? meh?
    copy = array.slice(0)
    while (numSamples--) {
      disc = SJS.Discrete(SJS._fillArrayWithNumber(copy.length, 1))
      index = disc.draw()
      result.push(copy[index])
      copy.splice(index, 1)
    }
  }
  return result
}

export function getRandomIntInclusivePareto (min, max, alpha = 1.0) {
  const probabilities = [] // probabilities
  for (let k = min; k <= max; ++k) {
    probabilities.push(1.0 / Math.pow(k, alpha)) // computed according to Paretto
  } // would be normalized by SJS

  const disc = SJS.Discrete(probabilities) // discrete sampler, returns value in the [0...probabilities.length-1] range
  const q = disc.draw() + min // back to [min...max] interval

  return q
}

export function getPareto (n) {
  return getRandomIntInclusivePareto(1, n, 1)
}

function myFunc (n) {
  for (let i = 0; i < n; i++) {
    const t = getRandomIntInclusivePareto(1, 1000, 1)
  }
}

export const options = {
  duration: '30m',
  maxRedirects: 0
}

export var t = 0
export default function () {
  if (t === 0) {
    t = 1
  }
  const res = http.get(
    `http://url-shortener4-dev.ap-south-1.elasticbeanstalk.com/${Math.floor(
      Math.random() * 999
    )}_${Math.floor(Math.random() * 999)}`
  )
  const fail = res.status === 302 ? 0 : 1
}
