<script lang="ts">
  import Nav from '../components/Nav.svelte'
  import LatestData from '../components/LatestData.svelte'
  import AllTimeGraph from '../components/AllTimeGraph.svelte'
</script>

<Nav />
<div class="page">
  <LatestData />
  <AllTimeGraph />
</div>

<style lang="sass">

  .page
    +page

</style>
