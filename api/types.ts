import { ObjectType, Field, Int, Float } from 'type-graphql'

// the total data that the API returns
@ObjectType({ description: 'All time COVID-19 data' })
export class TotalData {
  @Field(() => Int, { description: 'Total number of tests' })
  tests: number // total number of tests
  @Field(() => Int, { description: 'Total number of cases in Budapest' })
  casesBp: number // total number of cases in Budapest
  @Field(() => Int, {
    description: 'Total number of cases outside of Budapest'
  })
  casesOthers: number // total number of cases outside of Budapest
  @Field(() => Int, { description: 'Total number of cases in Hungary' })
  cases: number // total number of cases in Hungary
  @Field(() => Int, { description: 'Total number of deaths in Budapest' })
  deathsBp: number // total number of deaths in Budapest
  @Field(() => Int, {
    description: 'Total number of deaths outside of Budapest'
  })
  deathsOthers: number // total number of deaths outside of Budapest
  @Field(() => Int, { description: 'Total number of deaths in Hungary' })
  deaths: number // total number of deaths in Hungary
  @Field(() => Int, { description: 'Total number of recoveries in Budapest' })
  recoveriesBp: number // total number of recoveries in Budapest
  @Field(() => Int, {
    description: 'Total number of recoveries outside of Budapest'
  })
  recoveriesOthers: number // total number of recoveries outside of Budapest
  @Field(() => Int, { description: 'Total number of recoveries in Hungary' })
  recoveries: number // total number of recoveries in Hungary
  @Field(() => Int, { description: 'The population of Budapest' })
  populationBudapest: number // population of Budapest
  @Field(() => Int, { description: 'The population excluding Budapest' })
  populationOthers: number // population outside of Budapest
  @Field(() => Int, { description: 'The opulation of Hungary' })
  population: number // population of Hungary
  @Field(() => Float, {
    description: 'Rate of people with COVID-19 in Budapest'
  })
  caseRateBp: number // what percentage of Budapest is sick
  @Field(() => Float, {
    description: 'Rate of people with COVID-19 outside of Budapest'
  })
  caseRateOthers: number // what percentage outside of Budapest is sick
  @Field(() => Float, {
    description: 'Rate of people with COVID-19 in Hungary'
  })
  caseRate: number // what percentage of Hungary is sick
  @Field(() => Float, {
    description: 'Rate of people recovered from COVID-19 in Budapest'
  })
  recoveryRateBp: number // what percentage of Budapest has recovered
  @Field(() => Float, {
    description: 'Rate of people recovered from COVID-19 outside of Budapest'
  })
  recoveryRateOthers: number // what percentage outside of Budapest has recovered
  @Field(() => Float, {
    description: 'Rate of people recovered from COVID-19 in Hungary'
  })
  recoveryRate: number // what percentage of Hungary has recovered
  @Field(() => Float, {
    description: 'Rate of fatal COVID-19 cases in Budapest'
  })
  fatalityRateBp: number // fatal case rate in Budapest
  @Field(() => Float, {
    description: 'Rate of fatal COVID-19 cases outside of Budapest Budapest'
  })
  fatalityRateOthers: number // fatal case rate outside of Budapest
  @Field(() => Float, {
    description: 'Rate of fatal COVID-19 cases in Hungary'
  })
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
@ObjectType({ description: 'Additional (new) data for the given day' })
export class DayData {
  @Field({ description: 'The date of the data record' })
  day: string // the date of the record
  @Field(() => Int, { description: 'Additional tests made on the given day' })
  tests: number // additional tests made on the given day
  @Field(() => Int, {
    description: 'Additional cases in Budapest on the given day'
  })
  casesBp: number // additional cases in Budapest on the given day
  @Field(() => Int, {
    description: 'Additional cases outside of Budapest on the given day'
  })
  casesOthers: number // additional cases outside of Budapest on the given day
  @Field(() => Int, { description: 'Additional cases on the given day' })
  cases: number // additional cases on the given day
  @Field(() => Int, { description: 'Additional fatal cases on the given day' })
  deathsBp: number // additional fatal cases in Budapest on the given day
  @Field(() => Int, {
    description: 'Additional fatal cases outside of Budapest on the given day'
  })
  deathsOthers: number // additional fatal cases outside of Budapest on the given day
  @Field(() => Int, { description: 'Additional fatal cases on the given day' })
  deaths: number // additional fatal cases on the given day
  @Field(() => Int, {
    description: 'Additional recoveries in Budapest on the given day'
  })
  recoveriesBp: number // additional recoveries in Budapest on the given day
  @Field(() => Int, {
    description: 'Additional recoveries outside of Budapest on the given day'
  })
  recoveriesOthers: number // additional recoveries outside of Budapest on the given day
  @Field(() => Int, { description: 'Additional recoveries on the given day' })
  recoveries: number // additional recoveries on the given day
  @Field({ description: 'True, if no data was recorded' })
  nodata: boolean // if no data is recorded that day
  @Field(() => TotalData, { description: 'Total data on the recorded day' })
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
