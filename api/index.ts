import 'reflect-metadata'
import type { NowRequest, NowResponse } from '@vercel/node'
import { ApolloServer } from 'apollo-server-micro'
import { buildSchema } from 'type-graphql'
import { DataResolver } from './Resolver'

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

    apolloHandler = server.createHandler({ path: '/api' })
  }

  return apolloHandler
}
