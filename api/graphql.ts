import 'reflect-metadata'
import type { NowRequest, NowResponse } from '@vercel/node'
import { ApolloServer } from 'apollo-server-micro'
import { buildSchema, Query, Resolver } from 'type-graphql'
import { TotalData, ITotalData } from './types'
import { promises as fs } from 'fs'
import { join } from 'path'
import axios from 'axios'

@Resolver()
class DataResolver {
  @Query(() => TotalData)
  async allTime() {
    const data: ITotalData = JSON.parse(new TextDecoder().decode(await fs.readFile(join(__dirname, '../data.json'))))
      .total

    let hungaryInfo
    let budapestInfo
    try {
      hungaryInfo = await axios.get('https://restcountries.eu/rest/v2/alpha/hu')
    } catch (e) {
      throw new Error('Error requesting country data for HU')
    }
    try {
      budapestInfo = await axios.get('https://datacommons.org/api/landingpage/data/nuts/HU101')
    } catch (e) {
      throw new Error('Error requesting city data for Budapest')
    }

    let population = hungaryInfo.data.population,
      populationBudapest = budapestInfo.data.highlight.Population.data[0].data.Count_Person

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
      server = new ApolloServer({ schema })

    apolloHandler = server.createHandler({ path: '/api/graphql' })
  }

  return apolloHandler
}
