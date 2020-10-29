import type { GraphqlQuery } from './types'
import axios, { AxiosError, AxiosResponse } from 'axios'

export default async function query({
  query,
  variables = null
}: GraphqlQuery): Promise<Record<string, any>> {
  let response: Record<string, any>

  await axios('/api', {
    method: 'POST',
    data: JSON.stringify({ query, variables }),
    headers: { 'content-type': 'application/json' }
  })
    .then(({ data }: AxiosResponse) => (response = data.data))
    .catch((err: AxiosError) => (response = err))

  return response
}
