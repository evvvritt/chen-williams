<template lang="pug">
  aside.cart.fixed.overlay.z-overlay.p2.bg-gray.backdrop-blur
    background
    overlay-header.absolute.top-0.left-0.w-100(@close="$router.push({hash: null})")
    section.pt-2rows
</template>

<script>
import Background from '@/components/DotGrid'
import OverlayHeader from '@/components/OverlayHeader'
export default {
  name: 'Cart',
  components: { Background, OverlayHeader }
}
</script>

<style lang="scss">
.cart{
  .cw-grid__item{
    &:after, &:before{
      background:#8e8e8e;
    }
  }
}
</style>
