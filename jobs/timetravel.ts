import moment from 'moment-timezone'
import axios from 'axios'
import { readFileSync, writeFileSync } from 'fs'
import { exit } from 'process'
import { parse } from 'node-html-parser'
import type { ITotalData, IDayData } from '../api/types'
import { join } from 'path'

console.log(
  'WARNING: UNSUPPORTED SCRIPT. \nMAKE SURE TO READ THE COMMENTS IN THE "timetravel.js" file before running this.'
)

const createDataFromEl = (parsedData, el) =>
    Number(parsedData.querySelector(el).innerText.split(' ').join('')),
  dataFile = join(process.cwd(), './data.json')

if (!process.env.PRODUCTION)
  require('dotenv').config() // for development, make sure to create a .env file with the required environment variables
;(async () => {
  let month = '10'

  for (
    let i = 20; // prev day
    i < 27; // max day to go until
    i++
  ) {
    let covidData: { total: ITotalData; days: IDayData[] } = JSON.parse(
      new TextDecoder().decode(readFileSync(dataFile))
    )

    // check for around 6 PM. the site should be updated then
    let waybackURL = `https://archive.org/wayback/available?url=${process.env.API_URL.replace(
      'https://',
      ''
    ).replace(/(?<=(.*))\/$/, '')}&timestamp=2020${month}${
      i + 1 < 10 ? '0' + (i + 1) : i + 1
    }180000`
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
              moment(
                `2020-${month}-${i + 1 < 10 ? '0' + (i + 1) : i + 1}`,
                'YYYY-MM-DD'
              ).format('YYYY-MM-DD'),
              '\nPREV:\n',
              moment(
                `2020-${month}-${i + 1 < 10 ? '0' + (i + 1) : i + 1}`,
                'YYYY-MM-DD'
              )
                .subtract(1, 'days')
                .format('YYYY-MM-DD')
            )

            // get current data
            const parsedData = parse(data),
              tests = createDataFromEl(parsedData, process.env.TESTS_EL),
              currentCasesBp = createDataFromEl(
                parsedData,
                process.env.CASES_PEST_EL
              ),
              currentCasesOthers = createDataFromEl(
                parsedData,
                process.env.CASES_OTHERS_EL
              ),
              currentDeathsBp = createDataFromEl(
                parsedData,
                process.env.DEATHS_BP_EL
              ),
              currentDeathsOthers = createDataFromEl(
                parsedData,
                process.env.DEATHS_OTHERS_EL
              ),
              currentRecoveriesBp = createDataFromEl(
                parsedData,
                process.env.RECOVERIES_BP_EL
              ),
              currentRecoveriesOthers = createDataFromEl(
                parsedData,
                process.env.RECOVERIES_OTHERS_EL
              ),
              casesBp = currentCasesBp + currentDeathsBp + currentRecoveriesBp,
              casesOthers =
                currentCasesOthers +
                currentDeathsOthers +
                currentRecoveriesOthers,
              previousData = covidData['total']

            console.log('Processed/parsed data')

            // push a new day
            if (
              covidData['days'].find(
                (el) =>
                  el.day ===
                  moment(
                    `2020-${month}-${i + 1 < 10 ? '0' + (i + 1) : i + 1}`,
                    'YYYY-MM-DD'
                  ).format('YYYY-MM-DD')
              ) === undefined
            )
              covidData['days'].push({
                day: moment(
                  `2020-${month}-${i + 1 < 10 ? '0' + (i + 1) : i + 1}`,
                  'YYYY-MM-DD'
                ).format('YYYY-MM-DD'),
                tests: tests - previousData.tests,
                casesBp: casesBp - previousData.casesBp,
                casesOthers: casesOthers - previousData.casesOthers,
                deathsBp: currentDeathsBp - previousData.deathsBp,
                deathsOthers: currentDeathsOthers - previousData.deathsOthers,
                recoveriesBp: currentRecoveriesBp - previousData.recoveriesBp,
                recoveriesOthers:
                  currentRecoveriesOthers - previousData.recoveriesOthers,
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

            writeFileSync(
              dataFile,
              new TextEncoder().encode(JSON.stringify(covidData, null, 2))
            )
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
