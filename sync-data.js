// This file syncs the data in data.json with the API data
// it is an automated cron-job, running every second hour, or on push
// for more info, check .github/workflows/update-data.yml

const moment = require('moment-timezone'),
  axios = require('axios'),
  { readFileSync, writeFileSync } = require('fs'),
  { exit } = require('process'),
  { parse } = require('node-html-parser'),
  createDataFromEl = (parsedData, el) => Number(parsedData.querySelector(el).innerText.split(' ').join(''))

if (!process.env.PRODUCTION) require('dotenv').config() // for development, make sure to create a .env file with the required environment variables

moment.tz.setDefault('Europe/Budapest')

let covidData = JSON.parse(new TextDecoder().decode(readFileSync('data.json')))

axios
  .get(process.env.API_URL)
  .then(({ data }) => {
    console.log('Got data from API')

    // get current data
    const parsedData = parse(data),
      tests = createDataFromEl(parsedData, process.env.TESTS_EL),
      currentCasesBp = createDataFromEl(parsedData, process.env.CASES_PEST_EL),
      currentCasesOthers = createDataFromEl(parsedData, process.env.CASES_OTHERS_EL),
      currentDeathsBp = createDataFromEl(parsedData, process.env.DEATHS_BP_EL),
      currentDeathsOthers = createDataFromEl(parsedData, process.env.DEATHS_OTHERS_EL),
      currentRecoveriesBp = createDataFromEl(parsedData, process.env.RECOVERIES_BP_EL),
      currentRecoveriesOthers = createDataFromEl(parsedData, process.env.RECOVERIES_OTHERS_EL),
      casesBp = currentCasesBp + currentDeathsBp + currentRecoveriesBp,
      casesOthers = currentCasesOthers + currentDeathsOthers + currentRecoveriesOthers,
      previousData = covidData['total']

    console.log('Processed/parsed data')

    // check if yesterday is not existing
    if (covidData['days'].find((el) => el.day === moment().subtract(1, 'days').format('YYYY-MM-DD')) === undefined) {
      covidData['days'].push({
        day: moment().subtract(1, 'days').format('YYYY-MM-DD'),
        tests: 0,
        casesBp: 0,
        casesOthers: 0,
        deathsBp: 0,
        deathsOthers: 0,
        recoveriesBp: 0,
        recoveriesOthers: 0,
        nodata: true
      })
      writeFileSync('data.json', new TextEncoder().encode(JSON.stringify(covidData, null, 2)))
      console.log("Updated yesterday's data")
    }

    // check if this day was already pushed
    if (covidData['days'].find((el) => el.day === moment().format('YYYY-MM-DD')) !== undefined) {
      console.log('Day already pushed')
      exit(0)
    }

    // let's find the last update date
    for (const pElement of parsedData.querySelectorAll('p')) {
      if (pElement.innerText.includes('Legutolsó frissítés dátuma:')) {
        const lastUpdateDate = moment(new Date(pElement.innerText.replace('Legutolsó frissítés dátuma:', ''))).format(
          'YYYY-MM-DD'
        )

        if (moment().format('YYYY-MM-DD') !== lastUpdateDate) {
          console.log('Data did not yet update today...')
          exit(0)
        } else {
          // only check for the first occurance
          break
        }
      }
    }

    // the site did not update today
    // exit
    if (previousData.tests === tests) {
      console.log('Data did not update today...')
      exit(0)
    }

    // push a new day
    covidData['days'].push({
      day: moment().format('YYYY-MM-DD'),
      tests: tests - previousData.tests,
      casesBp: casesBp - previousData.casesBp,
      casesOthers: casesOthers - previousData.casesOthers,
      deathsBp: currentDeathsBp - previousData.deathsBp,
      deathsOthers: currentDeathsOthers - previousData.deathsOthers,
      recoveriesBp: currentRecoveriesBp - previousData.recoveriesBp,
      recoveriesOthers: currentRecoveriesOthers - previousData.recoveriesOthers,
      nodata: false,
      total: {
        tests,
        casesBp,
        casesOthers,
        deathsBp: currentDeathsBp,
        deathsOthers: currentDeathsOthers,
        recoveriesBp: currentRecoveriesBp,
        recoveriesOthers: currentRecoveriesOthers
      }
    })

    console.log("Got today's data")

    // update total data
    covidData['total'] = {
      tests,
      casesBp,
      casesOthers,
      deathsBp: currentDeathsBp,
      deathsOthers: currentDeathsOthers,
      recoveriesBp: currentRecoveriesBp,
      recoveriesOthers: currentRecoveriesOthers
    }

    console.log('Calculated total data')

    writeFileSync('data.json', new TextEncoder().encode(JSON.stringify(covidData, null, 2)))
    console.log('Wrote file')
  })
  .catch((err) => {
    console.error('Error: Could not fetch data: \n', err)
    exit(1)
  })
