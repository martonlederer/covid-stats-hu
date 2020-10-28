import 'reflect-metadata'
import type { NowRequest, NowResponse } from '@vercel/node'
import { ApolloServer } from 'apollo-server-micro'
import { buildSchema, Query, Resolver, Arg } from 'type-graphql'
import { TotalData, ITotalData, DayData, IDayData, IHungaryInfo } from './types'
import { promises as fs } from 'fs'
import { join } from 'path'
import axios from 'axios'
import moment from 'moment-timezone'

moment.tz.setDefault('Europe/Budapest')

@Resolver()
class DataResolver {
  // all time data
  @Query(() => TotalData)
  async allTime() {
    const data: ITotalData = JSON.parse(new TextDecoder().decode(await fs.readFile(join(__dirname, '../data.json'))))
      .total

    const { populationBudapest, population } = await this.getHungaryInfo()

    let apiData: TotalData = {
      ...data,
      populationBudapest,
      population,
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
  @Query(() => [DayData])
  async dailyData(
    @Arg('from', { defaultValue: '2020-06-01' }) from: string,
    @Arg('to', { defaultValue: moment().format('YYYY-MM-DD') }) to: string
  ): Promise<DayData[]> {
    if (moment(to).diff(from) < 0) throw new Error('From date is more than to date')
    const data: IDayData[] = JSON.parse(new TextDecoder().decode(await fs.readFile(join(__dirname, '../data.json'))))
        .days,
      { populationBudapest, population } = await this.getHungaryInfo()

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

    return apiDays.filter(({ day }) => moment(day).isBetween(from, to) || day === from || day === to)
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
      populationBudapest = budapestInfo.data.highlight.Population.data[0].data.Count_Person

    return { population, populationBudapest }
  }
}

export default async (req: NowRequest, res: NowResponse) => {
  const serverHandler = await loadApolloHandler()
  return serverHandler(req, res)
}

export const config = {
  api: { bodyParser: false }
}

let apolloHandler: (req: any, res: any) => Promise<void>

async function loadApolloHandler() {
  if (!apolloHandler) {
    const schema = await buildSchema({ resolvers: [DataResolver] }),
      server = new ApolloServer({ schema, playground: true, introspection: true })

    apolloHandler = server.createHandler({ path: '/api/graphql' })
  }

  return apolloHandler
}
