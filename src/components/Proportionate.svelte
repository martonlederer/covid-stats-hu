<script lang="ts">
  import Line from 'svelte-chartjs/src/Line.svelte'
  import proportionateQuery from '../queries/proportionate.gql'
  import query from '../utils/graphql'
  import Spinner from './Spinner.svelte'
  import { fade } from 'svelte/transition'
  import type { ExpandParams } from 'src/utils/types'
  import { createGradient } from '../utils/graphs'

  let data = loadData()

  async function loadData() {
    const data = await query({ query: proportionateQuery })

    let cases: number[] = [],
      dates: string[] = []

    for (const el of data.dailyData) {
      dates.push(el.day)
      cases.push((el.cases / el.tests) * 100)
    }

    return { dates, cases }
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
  <span>Arányos adatok</span>
  {#await data}
    <div class="loading-data" transition:fade={{ duration: 280 }}>
      <span>Betöltés...</span>
      <Spinner speed={800} />
    </div>
  {/await}
</h1>
<p class="description">A tesztekhez viszonyított fertőzési ráta</p>
{#await data then loadedData}
  <div class="proportionate" transition:expandTransition={{ duration: 300 }}>
    <Line
      data={{ labels: loadedData.dates, datasets: [{ label: 'Fertőzési ráta', data: loadedData.cases, backgroundColor: (context) => createGradient(
                context,
                {
                  colorStart: 'rgba(255, 160, 128, .7)',
                  colorEnd: 'rgba(255, 62, 0, .63)'
                }
              ), borderColor: createGradient }] }}
      options={{ maintainAspectRatio: false, elements: { line: { borderWidth: 2.7, borderCapStyle: 'round' }, point: { radius: 0 } }, tooltips: { mode: 'index', intersect: false, callbacks: { label: (tooltipItem) => `${Number(tooltipItem.value).toFixed(2)}%`, afterLabel: (tooltipItem) => (Number(tooltipItem.value) === 0 ? 'Nem áll rendelkezésre adat...' : '') } }, hover: { mode: 'nearest', intersect: true }, scales: { yAxes: [{ gridLines: { display: false } }], xAxes: [{ type: 'time', ticks: { autoSkip: true, maxTicksLimit: 30 } }] } }} />
  </div>
{/await}

<style lang="sass">

  h1.title
    +title
    +titleWithLoading
    margin-bottom: 0

  p.description
    +description

  .proportionate
    position: relative
    height: 300px
    margin-bottom: 1em

</style>
