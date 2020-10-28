import 'reflect-metadata'
import type { NowRequest, NowResponse } from '@vercel/node'
import { ApolloServer } from 'apollo-server-micro'
import { buildSchema, Query, Resolver } from 'type-graphql'

@Resolver()
class TestResolver {
  @Query(() => String)
  tests() {
    return 'test'
  }
}

export default async (req: NowRequest, res: NowResponse) => {
  const serverHandler = await getApolloHandler()
  return serverHandler(req, res)
}

export const config = {
  api: { bodyParser: false }
}

let apolloHandler: (req: any, res: any) => Promise<void>

async function getApolloHandler() {
  if (!apolloHandler) {
    const schema = await buildSchema({ resolvers: [TestResolver] }),
      server = new ApolloServer({ schema })

    apolloHandler = server.createHandler({ path: '/api/graphql' })
  }

  return apolloHandler
}
