import 'reflect-metadata'
import type { NowRequest, NowResponse } from '@vercel/node'
import { ApolloServer } from 'apollo-server-micro'
import { buildSchema, Query, Resolver } from 'type-graphql'
import { TotalData, ITotalData } from './types'
import { promises as fs } from 'fs'
import { join } from 'path'

@Resolver()
class DataResolver {
  @Query(() => TotalData)
  async allTime() {
    const data: ITotalData = JSON.parse(new TextDecoder().decode(await fs.readFile(join(__dirname, '../data.json'))))
      .total
    let apiData: TotalData = {
      ...data,
      populationBudapest: 0,
      population: 0,
      caseRateBp: 0,
      caseRate: 0,
      recoveryRateBp: 0,
      recoveryRate: 0,
      fatalityRateBp: 0,
      fatalityRate: 0
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
