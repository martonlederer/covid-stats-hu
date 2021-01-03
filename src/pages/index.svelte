<script lang="ts">
  import Nav from '../components/Nav.svelte'
  import LatestData from '../components/LatestData.svelte'
  import AllTimeGraph from '../components/AllTimeGraph.svelte'
  import DailyGraphs from '../components/DailyGraphs.svelte'
  import Proportionate from '../components/Proportionate.svelte'
  import SummaryData from '../components/SummaryData.svelte'
  import Footer from '../components/Footer.svelte'
  import Warning from '../components/Warning.svelte'
</script>

<Nav />
<div class="page">
  <LatestData />
  <AllTimeGraph />
  <DailyGraphs />
  <Proportionate />
  <SummaryData />
  <Warning />
  <Footer />
</div>

<style lang="sass">

  .page
    +page

</style>
