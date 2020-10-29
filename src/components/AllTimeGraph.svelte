<script lang="ts">
  import Line from 'svelte-chartjs/src/Line.svelte'
  import allTimeQuery from '../queries/allTime.gql'
  import query from '../utils/graphql'
  import Spinner from './Spinner.svelte'
  import { fade } from 'svelte/transition'

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

  function createGradient(
    context,
    colors: { colorStart?: string; colorEnd?: string } = {}
  ) {
    let gradient = context.chart.ctx.createLinearGradient(
      0,
      0,
      context.chart.width,
      context.chart.height
    )

    gradient.addColorStop(0, colors.colorStart ?? 'rgba(255, 160, 128, 1)')
    gradient.addColorStop(1, colors.colorEnd ?? 'rgb(255, 62, 0)')

    return gradient
  }
</script>

<h1 class="title">
  A járvány alakulása
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
<div class="all-time-graph">
  {#await data then loadedData}
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
  {/await}
</div>

<style lang="sass">

  h1.title
    +title
    +titleWithLoading
    margin-bottom: 0

  p.description
    +description

  .all-time-graph
    position: relative
    height: 300px

</style>
