// This file syncs the data in data.json with the API data
// it is an automated cron-job, running every day at 12 AM, or on push
// for more info, check .github/workflows/update-data.yml

const 
  moment = require('moment'),
  axios = require('axios'),
  { readFileSync, writeFileSync } = require('fs'),
  { exit } = require('process'),
  { parse } = require('node-html-parser'),

  createDataFromEl = (parsedData, el) => Number(parsedData.querySelector(el).innerText.split(' ').join(''))

if(!process.env.PRODUCTION) require('dotenv').config() // for development, make sure to create a .env file with the required environment variables

let covidData = JSON.parse(new TextDecoder().decode(readFileSync('data.json')))

axios
  .get(process.env.API_URL)
  .then(({ data }) => {
    console.log('Got data from API')

    // get current data
    const 
      parsedData = parse(data),
      tests = createDataFromEl(parsedData, process.env.TESTS_EL),
      currentCasesBp = createDataFromEl(parsedData, process.env.CASES_PEST_EL),
      currentCasesOthers = createDataFromEl(parsedData, process.env.CASES_OTHERS_EL),
      currentDeathsBp = createDataFromEl(parsedData, process.env.DEATHS_BP_EL),
      currentDeathsOthers = createDataFromEl(parsedData, process.env.DEATHS_OTHERS_EL),
      currentRecoveriesBp = createDataFromEl(parsedData, process.env.RECOVERIES_BP_EL),
      currentRecoveriesOthers = createDataFromEl(parsedData, process.env.RECOVERIES_OTHERS_EL),
      previousData = covidData['days'].find(el => el.day === moment().subtract(1, 'days').format('YYYY-MM-DD'))

    console.log('Processed/parsed data')

    // update total data
    covidData['total'] = {
      tests,
      casesBp: currentCasesBp + currentDeathsBp + currentRecoveriesBp,
      casesOthers: currentCasesOthers + currentDeathsOthers + currentRecoveriesOthers,
      deathsBp: currentDeathsBp,
      deathsOthers: currentDeathsOthers,
      recoveriesBp: currentRecoveriesBp,
      recoveriesOthers: currentRecoveriesOthers
    }

    console.log('Calculated total data')

    // push a new day
    if(covidData['days'].find(el => el.day === moment().format('YYYY-MM-DD')) === undefined)
      covidData['days'].push({
        day: moment().format('YYYY-MM-DD'),
        tests: tests - previousData.tests,
        casesBp: currentCasesBp - previousData.casesBp,
        casesOthers: currentCasesOthers - previousData.casesOthers,
        deathsBp: currentDeathsBp - previousData.deathsBp,
        deathsOthers: currentDeathsOthers - previousData.deathsOthers,
        recoveriesBp: currentRecoveriesBp - previousData.recoveriesBp,
        recoveriesOthers: currentRecoveriesOthers - previousData.recoveriesOthers
      })

    console.log('Got today\'s data')
    
    writeFileSync('data.json', new TextEncoder().encode(JSON.stringify(covidData, null, 2)))
    console.log('Wrote file')
  })
  .catch((err) => {
    console.error('Error: Could not fetch data: \n', err)
    exit(1)
  })