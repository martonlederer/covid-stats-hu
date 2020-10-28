import { ObjectType, Field } from 'type-graphql'

// the total data that the API returns
@ObjectType()
export class TotalData {
  @Field()
  tests: number // total number of tests
  @Field()
  casesBp: number // total number of cases in Budapest
  @Field()
  casesOthers: number // total number of cases outside of Budapest
  @Field()
  deathsBp: number // total number of deaths in Budapest
  @Field()
  deathsOthers: number // total number of deaths outside of Budapest
  @Field()
  recoveriesBp: number // total number of recoveries in Budapest
  @Field()
  recoveriesOthers: number // total number of recoveries outside of Budapest
  @Field()
  populationBudapest: number // population of Budapest
  @Field()
  population: number // population of Hungary
  @Field()
  caseRateBp: number // what percentage of Budapest is sick
  @Field()
  caseRate: number // what percentage of Hungary is sick
  @Field()
  recoveryRateBp: number // what percentage of Budapest has recovered
  @Field()
  recoveryRate: number // what percentage of Hungary has recovered
  @Field()
  fatalityRateBp: number // fatal case rate in Budapest
  @Field()
  fatalityRate: number // fatal case rate in Hungary
}

// the total data from data.json
export interface ITotalData {
  tests: number
  casesBp: number
  casesOthers: number
  deathsBp: number
  deathsOthers: number
  recoveriesBp: number
  recoveriesOthers: number
}
