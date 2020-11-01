<script lang="ts">
  let navHeight: number
  let scrollY: number
</script>

<svelte:window bind:scrollY />
<div class="Nav" bind:clientHeight={navHeight} class:scrolled={scrollY > 30}>
  <h1>Covid-19</h1>
  <div class="menu">
    <a href="/api" target="_blank" rel="noopener">API</a>
    <a
      href="https://marton.lederer.hu"
      target="_blank"
      rel="noopener">Készítő</a>
  </div>
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
    z-index: 1000
    justify-content: space-between
    transition: all .3s

    &.scrolled
      box-shadow: 0 -0.4rem 0.9rem 0.2rem rgba(0, 0, 0, .5)

    h1
      font-size: 2.2em
      text-transform: uppercase
      color: $theme-color
      text-decoration: none

    .menu
      display: flex
      align-items: center

      a
        margin: 0 1em -.2em
        color: $secondary-font-color
        text-decoration: none
        transition: all .3s

        &:hover
          opacity: .72

        &:active
          transform: scale(.8)

        &:last-child
          margin-right: 0

  .nav-placeholder
    width: 100vw

</style>
