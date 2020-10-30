<script lang="ts">
  import Nav from '../components/Nav.svelte'
  import LatestData from '../components/LatestData.svelte'
  import AllTimeGraph from '../components/AllTimeGraph.svelte'
  import DailyGraphs from '../components/DailyGraphs.svelte'
  import SummaryData from '../components/SummaryData.svelte'
</script>

<Nav />
<div class="page">
  <LatestData />
  <AllTimeGraph />
  <DailyGraphs />
  <SummaryData />
</div>

<style lang="sass">

  .page
    +page

</style>
