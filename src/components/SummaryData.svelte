<script lang="ts">
  import summaryQuery from '../queries/summary.gql'
  import query from '../utils/graphql'
  import Spinner from './Spinner.svelte'
  import { fade } from 'svelte/transition'
  import { fixPercentage, prettierNumber } from '../utils/number'

  let data = loadData()

  async function loadData() {
    const data = await query({ query: summaryQuery })

    return data.allTime
  }
</script>

<h1 class="title">
  <span>Összegzés</span>
  {#await data}
    <div class="loading-data" transition:fade={{ duration: 280 }}>
      <span>Betöltés...</span>
      <Spinner speed={800} />
    </div>
  {/await}
</h1>
<div class="summary">
  {#await data then loadedData}
    <div class="data blue" transition:fade={{ duration: 300 }}>
      <h1>{prettierNumber(loadedData.tests)}</h1>
      <span>Teszt</span>
    </div>
    <div class="data" transition:fade={{ duration: 300 }}>
      <h1>{prettierNumber(loadedData.cases)}</h1>
      <span>Fertőzött</span>
    </div>
    <div class="data green" transition:fade={{ duration: 300 }}>
      <h1>{prettierNumber(loadedData.recoveries)}</h1>
      <span>Felépült</span>
    </div>
    <div class="data black" transition:fade={{ duration: 300 }}>
      <h1>{prettierNumber(loadedData.deaths)}</h1>
      <span>Haláleset</span>
    </div>
    <div class="data green" transition:fade={{ duration: 300 }}>
      <h1>{fixPercentage(loadedData.recoveryRate)}%</h1>
      <span>gyógyulás</span>
    </div>
    <div class="data black" transition:fade={{ duration: 300 }}>
      <h1>{fixPercentage(loadedData.fatalityRate)}%</h1>
      <span>halálozás</span>
    </div>
    <div class="data" transition:fade={{ duration: 300 }}>
      <h1>{fixPercentage(loadedData.caseRate)}%</h1>
      <span>beteg az országban</span>
    </div>
  {/await}
</div>

<style lang="sass">

  h1.title
    +title
    +titleWithLoading
    margin-bottom: .4em

  .summary
    display: flex
    flex-wrap: wrap
    justify-content: space-between

    @media screen and (max-width: 720px)
      display: block
      flex-wrap: unset

    .data
      width: 26%
      border-radius: 18px
      padding: 1.4em 0
      text-align: center
      color: $theme-color
      border: 3px solid $theme-color
      background-color: rgba($theme-color, .45)        
      margin:
        left: auto
        right: auto
        bottom: 1.8em

      @media screen and (max-width: 1300px)
        width: 30%

      @media screen and (max-width: 720px)
        width: 100%

      h1
        text-align: center
        font-size: 3.2em
        font-weight: 600
        color: $theme-color
        margin-bottom: -.1em

      span
        font-size: .95em
        color: $theme-color
        text-transform: uppercase
        text-align: center
        font-weight: 400

      &.black
        color: #000
        border-color: #000
        background-color: rgba(0, 0, 0, .63)

        h1, span
          color: #000

      &.green
        color: #00f535
        border-color: #00f535
        background-color: rgba(0, 245, 53, .365)

        h1, span
          color: #00f535

      &.blue
        color: #00ccf5
        border-color: #00ccf5
        background-color: rgba(0, 204, 245, .365)

        h1, span
          color: #00ccf5

</style>
