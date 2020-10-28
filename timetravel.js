// This file uses archive.org to fetch cases in the past
// huge thanks to them, they made this project possible
// i could not have gotten the actual historical data without them

// to use it, update the month variable (line 17) and set the prev day variable (i) in the for loop (line 19) and the max day to go until
// it is recommended to repeat the fetching in the range of around 10-15 days

// this is a hardcoded script
// not recommended in production or to learn from
// i only used this to fetch historical covid data

// this should have a better way to check if there has been a publish between two days
// i also did not test changing the month and using the first day of the month in a run
// i calculated that by hand, just to make sure it is the right data

// if you decide to use this script, I cannot give you any support
// make sure to create a .env file with the required environment variables tho

// node timetravel.js

// - Marton Lederer

console.log(
  'WARNING: UNSUPPORTED SCRIPT. \nMAKE SURE TO READ THE COMMENTS IN THE "timetravel.js" file before running this.'
)

const moment = require('moment'),
  axios = require('axios'),
  { readFileSync, writeFileSync } = require('fs'),
  { exit } = require('process'),
  { parse } = require('node-html-parser'),
  createDataFromEl = (parsedData, el) => Number(parsedData.querySelector(el).innerText.split(' ').join(''))

if (!process.env.PRODUCTION)
  require('dotenv').config() // for development, make sure to create a .env file with the required environment variables
;(async () => {
  let month = '10'

  for (
    let i = 20; // prev day
    i < 27; // max day to go until
    i++
  ) {
    let covidData = JSON.parse(new TextDecoder().decode(readFileSync('data.json')))

    // check for around 6 PM. the site should be updated then
    let waybackURL = `https://archive.org/wayback/available?url=${process.env.API_URL.replace('https://', '').replace(
      /(?<=(.*))\/$/,
      ''
    )}&timestamp=2020${month}${i + 1 < 10 ? '0' + (i + 1) : i + 1}180000`
    console.log(waybackURL)

    await axios
      .get(waybackURL)
      .then(async (oldApiURLData) => {
        if (
          oldApiURLData.data.archived_snapshots === {} ||
          oldApiURLData.data.archived_snapshots === undefined ||
          oldApiURLData.data.archived_snapshots === null ||
          oldApiURLData.data.archived_snapshots.closest === {} ||
          oldApiURLData.data.archived_snapshots.closest === undefined ||
          oldApiURLData.data.archived_snapshots.closest === null
        ) {
          console.log('no data again')
          exit(1)
        }
        const oldApiURL = oldApiURLData.data.archived_snapshots.closest.url

        console.log(oldApiURL)

        // the next bit is just copied from the sync-data script
        await axios
          .get(oldApiURL)
          .then(({ data }) => {
            console.log('Got data from API')
            console.log(
              'DAY: \n',
              moment(`2020-${month}-${i + 1 < 10 ? '0' + (i + 1) : i + 1}`, 'YYYY-MM-DD').format('YYYY-MM-DD'),
              '\nPREV:\n',
              moment(`2020-${month}-${i + 1 < 10 ? '0' + (i + 1) : i + 1}`, 'YYYY-MM-DD')
                .subtract(1, 'days')
                .format('YYYY-MM-DD')
            )

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

            // push a new day
            if (
              covidData['days'].find(
                (el) =>
                  el.day ===
                  moment(`2020-${month}-${i + 1 < 10 ? '0' + (i + 1) : i + 1}`, 'YYYY-MM-DD').format('YYYY-MM-DD')
              ) === undefined
            )
              covidData['days'].push({
                day: moment(`2020-${month}-${i + 1 < 10 ? '0' + (i + 1) : i + 1}`, 'YYYY-MM-DD').format('YYYY-MM-DD'),
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
            //exit(1)
          })
      })
      .catch((err) => console.log('WAYBACK ERROR\n', err))
  }
})()
