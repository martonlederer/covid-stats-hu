import { Query, Resolver, Arg } from 'type-graphql'
import { TotalData, ITotalData, DayData, IDayData, IHungaryInfo } from './types'
import { promises as fs } from 'fs'
import { join } from 'path'
import axios from 'axios'
import moment from 'moment-timezone'

moment.tz.setDefault('Europe/Budapest')

@Resolver()
export class DataResolver {
  // all time data
  @Query(() => TotalData, { description: 'All time COVID-19 data in Hungary' })
  async allTime() {
    const data: ITotalData = JSON.parse(new TextDecoder().decode(await fs.readFile(join(__dirname, '../data.json'))))
      .total

    const { populationBudapest, population, populationOthers } = await this.getHungaryInfo()

    let apiData: TotalData = {
      ...data,
      populationBudapest,
      population,
      populationOthers,
      cases: data.casesBp + data.casesOthers,
      deaths: data.deathsBp + data.deathsOthers,
      recoveries: data.recoveriesBp + data.recoveriesOthers,
      caseRateBp: (data.casesBp / populationBudapest) * 100,
      caseRateOthers: (data.casesOthers / (population - populationBudapest)) * 100,
      caseRate: ((data.casesBp + data.casesOthers) / population) * 100,
      recoveryRateBp: (data.recoveriesBp / data.casesBp) * 100,
      recoveryRateOthers: (data.recoveriesOthers / data.casesOthers) * 100,
      recoveryRate: ((data.recoveriesBp + data.recoveriesOthers) / (data.casesBp + data.casesOthers)) * 100,
      fatalityRateBp: (data.deathsBp / data.casesBp) * 100,
      fatalityRateOthers: (data.deathsOthers / data.casesOthers) * 100,
      fatalityRate: ((data.deathsBp + data.deathsOthers) / (data.casesBp + data.casesOthers)) * 100
    }

    return apiData
  }

  // days data
  @Query(() => [DayData], { description: 'List of daily additional datas and total datas' })
  async dailyData(
    @Arg('from', { defaultValue: '2020-06-01', description: 'The first record to return (date)' }) from: string,
    @Arg('to', { defaultValue: moment().format('YYYY-MM-DD'), description: 'The last record to return (date)' })
    to: string
  ): Promise<DayData[]> {
    if (moment(to).diff(from) < 0) throw new Error('From date is more than to date')
    const data: IDayData[] = JSON.parse(new TextDecoder().decode(await fs.readFile(join(__dirname, '../data.json'))))
        .days,
      { populationBudapest, population, populationOthers } = await this.getHungaryInfo()

    let apiDays: DayData[] = []

    for (const day of data) {
      apiDays.push({
        ...day,
        cases: day.casesBp + day.casesOthers,
        deaths: day.deathsBp + day.deathsOthers,
        recoveries: day.recoveriesBp + day.recoveriesOthers,
        total: {
          ...day.total,
          populationBudapest, // we add the population too, it might be useful
          population,
          populationOthers,
          cases: day.total.casesBp + day.total.casesOthers,
          deaths: day.total.deathsBp + day.total.deathsOthers,
          recoveries: day.total.recoveriesBp + day.total.recoveriesOthers,
          caseRateBp: (day.total.casesBp / populationBudapest) * 100,
          caseRateOthers: (day.total.casesOthers / (population - populationBudapest)) * 100,
          caseRate: ((day.total.casesBp + day.total.casesOthers) / population) * 100,
          recoveryRateBp: (day.total.recoveriesBp / day.total.casesBp) * 100,
          recoveryRateOthers: (day.total.recoveriesOthers / day.total.casesOthers) * 100,
          recoveryRate:
            ((day.total.recoveriesBp + day.total.recoveriesOthers) / (day.total.casesBp + day.total.casesOthers)) * 100,
          fatalityRateBp: (day.total.deathsBp / day.total.casesBp) * 100,
          fatalityRateOthers: (day.total.deathsOthers / day.total.casesOthers) * 100,
          fatalityRate:
            ((day.total.deathsBp + day.total.deathsOthers) / (day.total.casesBp + day.total.casesOthers)) * 100
        }
      })
    }

    return apiDays.filter(
      ({ day }) =>
        moment(day).isBetween(moment(from).format('YYYY-MM-DD'), moment(to).format('YYYY-MM-DD')) ||
        day === moment(from).format('YYYY-MM-DD') ||
        day === moment(to).format('YYYY-MM-DD')
    )
  }

  async getHungaryInfo(): Promise<IHungaryInfo> {
    let hungaryInfo
    let budapestInfo
    try {
      hungaryInfo = await axios.get('https://restcountries.eu/rest/v2/alpha/hu')
    } catch (e) {
      throw new Error(`Error requesting country data for HU: \n${e}`)
    }
    try {
      budapestInfo = await axios.get('https://datacommons.org/api/landingpage/data/nuts/HU101')
    } catch (e) {
      throw new Error(`Error requesting city data for Budapest: \n${e}`)
    }

    let population = hungaryInfo.data.population,
      populationBudapest = budapestInfo.data.highlight.Population.data[0].data.Count_Person,
      populationOthers = population - populationBudapest

    return { population, populationBudapest, populationOthers }
  }
}
