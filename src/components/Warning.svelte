<script lang="ts">
  import { fade } from 'svelte/transition'
</script>

<h1 class="title" in:fade={{ duration: 300 }}>Figyelmeztetés</h1>
<p class="description">
  Az oldal nem hivatalos és semmilyen felelősséget nem vállal a megjelenített
  adatokért. Ez csupán egy számítógépes kísérlet és koncepció bizonyítás.
  <br />Az adatok kizárólagos forrása a
  <a
    href="https://koronavirus.gov.hu"
    target="blank"
    rel="noopener">koronavirus.gov.hu</a>. A kiírt adatok célja pusztán
  demonstárció, a valóságnak nem minden esetben felelnek meg, mert a rendszer
  Október 28. előtt nem tudott mindent elmenteni.
</p>

<style lang="sass">

  h1.title
    +title

  p.description
    +description

</style>
