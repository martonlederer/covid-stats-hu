# covid-stats-hu
Deep analytics about the coronavirus in Hungary.
Credits to [koronavirus.gov.hu](https://koronavirus.gov.hu).

**covid-stats-hu** holds the website and the automated script, that pulls data from the API and updated the `data.json` file with the latest infos about the COVID-19 virus in Hungary.

`sync-data.ts` runs as a github action every day, to sync data.

## TODO:
The data pulling script started it's operation on 2020-10-28. All data before that was pulled from [web.archive.org](https://web.archive.org/) with the `timetravel.ts` script, and some days are missing data. TODO: manually get the data for these days.