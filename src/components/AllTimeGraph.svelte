<script lang="ts">
  import Line from 'svelte-chartjs/src/Line.svelte'
  import allTimeQuery from '../queries/allTime.gql'
  import query from '../utils/graphql'
  import Spinner from './Spinner.svelte'
  import { fade } from 'svelte/transition'
  import type { ExpandParams } from 'src/utils/types'
  import { createGradient } from '../utils/graphs'

  let data = loadData()

  async function loadData() {
    const data = await query({ query: allTimeQuery })

    let cases: number[] = [],
      deaths: number[] = [],
      recoveries: number[] = [],
      dates: string[] = []

    for (const el of data.dailyData) {
      dates.push(el.day)
      cases.push(el.total.cases)
      deaths.push(el.total.deaths)
      recoveries.push(el.total.recoveries)
    }

    return { dates, cases, deaths, recoveries }
  }

  function expandTransition(
    node: Element,
    { duration, delay, easing }: ExpandParams
  ) {
    const style = getComputedStyle(node),
      targetOpacity = +style.opacity,
      targetTransform = style.transform === 'none' ? '' : style.transform

    return {
      delay,
      duration,
      easing,
      css: (t, u) => `
        transform: ${targetTransform} scaleY(${t}) translateY(${-t / 120}%);
        opacity: ${targetOpacity - u}`
    }
  }
</script>

<h1 class="title">
  <span>A járvány alakulása</span>
  {#await data}
    <div class="loading-data" transition:fade={{ duration: 280 }}>
      <span>Betöltés...</span>
      <Spinner speed={800} />
    </div>
  {/await}
</h1>
<p class="description">
  A cimkékre kattintva lehet megjeleníteni/elrejteni adatokat
</p>
{#await data then loadedData}
  <div class="all-time-graph" transition:expandTransition={{ duration: 300 }}>
    <Line
      data={{ labels: loadedData.dates, datasets: [{ label: 'Összes fertőzött', data: loadedData.cases, backgroundColor: (context) => createGradient(
                context,
                {
                  colorStart: 'rgba(255, 160, 128, .7)',
                  colorEnd: 'rgba(255, 62, 0, .63)'
                }
              ), borderColor: createGradient }, { label: 'Összes gyógyult', data: loadedData.recoveries, borderColor: (context) => createGradient(
                context,
                { colorStart: '#a8f0b7', colorEnd: '#00f535' }
              ) }, { label: 'Összes elhunyt', data: loadedData.deaths, borderColor: (context) => createGradient(
                context,
                { colorStart: 'rgba(0, 0, 0, .66)', colorEnd: '#000' }
              ) }] }}
      options={{ maintainAspectRatio: false, elements: { line: { borderWidth: 4.3, borderCapStyle: 'round' }, point: { radius: 0 } }, tooltips: { mode: 'index', intersect: false }, hover: { mode: 'nearest', intersect: true }, scales: { yAxes: [{ gridLines: { display: false } }], xAxes: [{ type: 'time', ticks: { autoSkip: true, maxTicksLimit: 30 } }] } }} />
  </div>
{/await}
<p class="description end">
  Forrás:
  <a href="https://koronavirus.gov.hu" target="_blank">koronavirus.gov.hu</a>
</p>

<style lang="sass">

  h1.title
    +title
    +titleWithLoading
    margin-bottom: 0

  p.description
    +description

    &.end
      margin-bottom: 2em
      text-align: center

  .all-time-graph
    position: relative
    height: 300px
    margin-bottom: 1em

</style>
