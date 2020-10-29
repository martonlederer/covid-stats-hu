import type { DocumentNode } from 'graphql'

export interface GraphqlQuery {
  query: DocumentNode | string
  variables?: Record<string, any>
}
