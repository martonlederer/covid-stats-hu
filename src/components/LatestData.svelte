<script lang="ts">
  import query from '../utils/graphql'
  import todayQuery from '../queries/today.gql'
  import moment from 'moment-timezone'
  import Spinner from './Spinner.svelte'
  import { fade } from 'svelte/transition'
  import { prettierNumber } from '../utils/number'

  moment.tz.setDefault('Europe/Budapest')

  let today = getTodayData(),
    count = 0,
    counter = setInterval(() => count++, 33)

  async function getTodayData() {
    return await query({
      query: todayQuery,
      variables: {
        from: moment().subtract(1, 'days').format('YYYY-MM-DD'),
        to: moment().format('YYYY-MM-DD')
      }
    })
  }

  today.finally(() => clearInterval(counter))
</script>

<h1 class="title">
  <span>Mai adatok</span>
  {#await today}
    <div class="loading-data" transition:fade={{ duration: 280 }}>
      <span>Betöltés...</span>
      <Spinner speed={800} />
    </div>
  {/await}
</h1>
<div class="latest-data">
  <div class="data cases">
    {#await today}
      <h1>+{prettierNumber(count)}</h1>
    {:then loadedToday}
      <h1>
        +{prettierNumber(loadedToday.dailyData[loadedToday.dailyData.length - 1].cases)}
      </h1>
    {/await}
    <span>pozitív eset</span>
  </div>
  <div class="data deaths">
    {#await today}
      <h1>+{prettierNumber(count)}</h1>
    {:then loadedToday}
      <h1>
        +{prettierNumber(loadedToday.dailyData[loadedToday.dailyData.length - 1].deaths)}
      </h1>
    {/await}
    <span>elhunyt</span>
  </div>
  <div class="data recoveries">
    {#await today}
      <h1>+{prettierNumber(count)}</h1>
    {:then loadedToday}
      <h1>
        +{prettierNumber(loadedToday.dailyData[loadedToday.dailyData.length - 1].recoveries)}
      </h1>
    {/await}
    <span>felépült</span>
  </div>
  <div class="data tests">
    {#await today}
      <h1>+{prettierNumber(count)}</h1>
    {:then loadedToday}
      <h1>
        +{prettierNumber(loadedToday.dailyData[loadedToday.dailyData.length - 1].tests)}
      </h1>
    {/await}
    <span>teszt</span>
  </div>
</div>

<style lang="sass">

  h1.title
    +title
    +titleWithLoading

  .latest-data
    display: flex
    align-items: flex-start
    justify-content: space-between
    margin-bottom: 2.5em

    @media screen and (max-width: 720px)
      display: block

    .data
      width: 23%
      border-radius: 18px
      padding: 1.4em 0
      cursor: pointer
      text-align: center
      transition: all .3s

      @media screen and (max-width: 720px)
        width: auto

      h1
        font-size: 3em
        color: $primary-font-color
        font-weight: 500
        text-align: center
        margin-bottom: .14em

      &.cases h1
        color: $theme-color

      &.deaths h1
        color: #000

      &.recoveries h1
        color: #00f535

      &.tests h1
        color: #00ccf5

      span
        font-size: .8em
        font-weight: 500
        text-align: center
        padding: .3em .65em
        background-color: rgba($theme-color, .22)
        border: 2px solid rgba($theme-color, .7)
        text-transform: uppercase
        color: $theme-color
        margin: 0 auto
        border-radius: .6em

      &:hover
        background-color: #f1f1f1

</style>
