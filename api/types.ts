import { ObjectType, Field, Int, Float } from 'type-graphql'

// the total data that the API returns
@ObjectType()
export class TotalData {
  @Field((type) => Int)
  tests: number // total number of tests
  @Field((type) => Int)
  casesBp: number // total number of cases in Budapest
  @Field((type) => Int)
  casesOthers: number // total number of cases outside of Budapest
  @Field((type) => Int)
  cases: number // total number of cases in Hungary
  @Field((type) => Int)
  deathsBp: number // total number of deaths in Budapest
  @Field((type) => Int)
  deathsOthers: number // total number of deaths outside of Budapest
  @Field((type) => Int)
  deaths: number // total number of deaths in Hungary
  @Field((type) => Int)
  recoveriesBp: number // total number of recoveries in Budapest
  @Field((type) => Int)
  recoveriesOthers: number // total number of recoveries outside of Budapest
  @Field((type) => Int)
  recoveries: number // total number of recoveries in Hungary
  @Field((type) => Int)
  populationBudapest: number // population of Budapest
  @Field((type) => Int)
  populationOthers: number // population outside of Budapest
  @Field((type) => Int)
  population: number // population of Hungary
  @Field((type) => Float)
  caseRateBp: number // what percentage of Budapest is sick
  @Field((type) => Float)
  caseRateOthers: number // what percentage outside of Budapest is sick
  @Field((type) => Float)
  caseRate: number // what percentage of Hungary is sick
  @Field((type) => Float)
  recoveryRateBp: number // what percentage of Budapest has recovered
  @Field((type) => Float)
  recoveryRateOthers: number // what percentage outside of Budapest has recovered
  @Field((type) => Float)
  recoveryRate: number // what percentage of Hungary has recovered
  @Field((type) => Float)
  fatalityRateBp: number // fatal case rate in Budapest
  @Field((type) => Float)
  fatalityRateOthers: number // fatal case rate outside of Budapest
  @Field((type) => Float)
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
  @Field((type) => Int)
  tests: number // additional tests made on the given day
  @Field((type) => Int)
  casesBp: number // additional cases in Budapest on the given day
  @Field((type) => Int)
  casesOthers: number // additional cases outside of Budapest on the given day
  @Field((type) => Int)
  cases: number // additional cases on the given day
  @Field((type) => Int)
  deathsBp: number // additional fatal cases in Budapest on the given day
  @Field((type) => Int)
  deathsOthers: number // additional fatal cases outside of Budapest on the given day
  @Field((type) => Int)
  deaths: number // additional fatal cases on the given day
  @Field((type) => Int)
  recoveriesBp: number // additional recoveries  in Budapest on the given day
  @Field((type) => Int)
  recoveriesOthers: number // additional recoveries outside of Budapest on the given day
  @Field((type) => Int)
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
  populationOthers: number
}
