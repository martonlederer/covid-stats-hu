<script lang="ts">
  import { onMount } from 'svelte'
  import query from '../utils/graphql'
  import Nav from '../components/Nav.svelte'

  onMount(async () => {
    console.log(
      await query({
        query: `
      query{
        allTime {
          tests
          cases
        }
      }
    `
      })
    )
  })
</script>

<Nav />
<div class="page">
  test
  <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
</div>

<style lang="sass">

  .page
    +page

</style>
