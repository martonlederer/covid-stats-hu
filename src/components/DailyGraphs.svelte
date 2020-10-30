<script lang="ts">
  import Line from 'svelte-chartjs/src/Line.svelte'
  import dailyQuery from '../queries/daily.gql'
  import query from '../utils/graphql'
  import Spinner from './Spinner.svelte'
  import { fade } from 'svelte/transition'
  import { createGradient } from '../utils/graphs'

  let data = loadDailyData()

  async function loadDailyData() {
    const data = await query({ query: dailyQuery })

    let cases: number[] = [],
      deaths: number[] = [],
      recoveries: number[] = [],
      tests: number[] = [],
      dates: string[] = []

    for (const dta of data.dailyData) {
      dates.push(dta.day)
      cases.push(dta.cases)
      deaths.push(dta.deaths)
      recoveries.push(dta.recoveries)
      tests.push(dta.tests)
    }

    return { cases, deaths, recoveries, tests, dates }
  }
</script>

<h1 class="title">
  <span>Napi adatok</span>
  {#await data}
    <div class="loading-data" transition:fade={{ duration: 280 }}>
      <span>Betöltés...</span>
      <Spinner speed={800} />
    </div>
  {/await}
</h1>
<p class="description">
  Plusz tesztek, pozitív esetek, halálozások, stb. naponta
</p>
<div class="daily-graphs">
  {#await data then loadedData}
    <div class="graph" transition:fade={{ duration: 300 }}>
      <h1>Új tesztek</h1>
      <div class="chart">
        <Line
          data={{ labels: loadedData.dates, datasets: [{ label: 'Napi új tesztek', data: loadedData.tests, backgroundColor: (context) => createGradient(
                    context,
                    {
                      colorStart: 'rgba(121, 207, 224, .7)',
                      colorEnd: 'rgba(0, 204, 245, .63)'
                    }
                  ), borderColor: (context) => createGradient(context, {
                    colorStart: '#79cfe0',
                    colorEnd: '#00ccf5'
                  }) }] }}
          options={{ maintainAspectRatio: false, elements: { line: { borderWidth: 2, borderCapStyle: 'round' }, point: { radius: 0 } }, tooltips: { mode: 'index', intersect: false, callbacks: { label: (tooltipItem) => `${tooltipItem.value > 0 ? '+' : ''}${tooltipItem.value}`, afterLabel: (tooltipItem) => (tooltipItem.value < 0 ? '\nValószínűleg helytelen adat' : '') } }, hover: { mode: 'nearest', intersect: true }, scales: { yAxes: [{ gridLines: { display: false }, ticks: { display: false } }], xAxes: [{ type: 'time', ticks: { autoSkip: true, maxTicksLimit: 12 } }] } }} />
      </div>
    </div>
  {/await}
</div>

<style lang="sass">

  h1.title
    +title
    +titleWithLoading
    margin: 0

  p.description
    +description
    margin-bottom: .7em

  .daily-graphs
    display: flex
    flex-wrap: wrap

    .graph
      width: 47%

      h1
        font-size: 1.5em
        color: $secondary-font-color
        font-weight: 400
        margin-bottom: -.3em
      
      .chart
        height: 230px
        position: relative

</style>
