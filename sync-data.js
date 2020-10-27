const 
  moment = require('moment'),
  { readFileSync, writeFileSync } = require('fs')

let data = JSON.parse(new TextDecoder().decode(readFileSync('data.json')))

console.log(moment().format('YYYY-MM-DD'), data)

data.push({
  day: moment().format('YYYY-MM-DD'),
  tests: 12000,
  cases: 1800,
  death: 10,
  recoveries: 40
})

writeFileSync('data.json', new TextEncoder().encode(JSON.stringify(data, null, 2)))