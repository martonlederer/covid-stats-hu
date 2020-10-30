import type { DocumentNode } from 'graphql'

export interface GraphqlQuery {
  query: DocumentNode | string
  variables?: Record<string, any>
}

type EasingFunction = (t: number) => number

export interface ExpandParams {
  delay?: number
  duration?: number
  easing?: EasingFunction
}
