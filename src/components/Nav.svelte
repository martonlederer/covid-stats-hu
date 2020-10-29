<script lang="ts">
  let navHeight: number
  let scrollY: number
</script>

<svelte:window bind:scrollY />
<div class="Nav" bind:clientHeight={navHeight} class:scrolled={scrollY > 30}>
  <h1>Covid-19</h1>
</div>
<div class="nav-placeholder" style="height: {navHeight}px" />

<style lang="sass">

  .Nav
    display: flex
    position: fixed
    top: 0
    left: 0
    right: 0
    padding: .55em 2.65em
    background-color: #fff
    box-shadow: none
    align-items: center
    justify-content: space-between
    transition: all .3s

    &.scrolled
      box-shadow: 0 -0.4rem 0.9rem 0.2rem rgba(0, 0, 0, .5)

    h1
      font-size: 2.2em
      text-transform: uppercase
      color: $primary-font-color
      text-decoration: none

  .nav-placeholder
    width: 100vw

</style>
