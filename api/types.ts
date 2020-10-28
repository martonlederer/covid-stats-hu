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
  caseRateOthers: number // what percentage outside of Budapest is sick
  @Field()
  caseRate: number // what percentage of Hungary is sick
  @Field()
  recoveryRateBp: number // what percentage of Budapest has recovered
  @Field()
  recoveryRateOthers: number // what percentage outside of Budapest has recovered
  @Field()
  recoveryRate: number // what percentage of Hungary has recovered
  @Field()
  fatalityRateBp: number // fatal case rate in Budapest
  @Field()
  fatalityRateOthers: number // fatal case rate outside of Budapest
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

// daily data saved in data.json
@ObjectType()
export class DayData {
  @Field()
  day: string // the date of the record
  @Field()
  tests: number // additional tests made on the given day
  @Field()
  casesBp: number // additional cases in Budapest on the given day
  @Field()
  casesOthers: number // additional cases outside of Budapest on the given day
  @Field()
  cases: number // additional cases on the given day
  @Field()
  deathsBp: number // additional fatal cases in Budapest on the given day
  @Field()
  deathsOthers: number // additional fatal cases outside of Budapest on the given day
  @Field()
  deaths: number // additional fatal cases on the given day
  @Field()
  recoveriesBp: number // additional recoveries  in Budapest on the given day
  @Field()
  recoveriesOthers: number // additional recoveries outside of Budapest on the given day
  @Field()
  recoveries: number // additional revoceries on the given day
  @Field()
  nodata: boolean // if no data is recorded that day
  @Field(() => TotalData)
  total: TotalData // total data until that day
}

// daily data interface
export interface IDayData {
  day: string
  tests: number
  casesBp: number
  casesOthers: number
  deathsBp: number
  deathsOthers: number
  recoveriesBp: number
  recoveriesOthers: number
  nodata: boolean
  total: ITotalData
}

// info about the country
export interface IHungaryInfo {
  populationBudapest: number
  population: number
}
