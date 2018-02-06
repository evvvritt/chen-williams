<template lang="pug">
  aside.fixed.overlay.z-overlay.p2.bg-gray.backdrop-blur
    overlay-header.absolute.top-0.left-0.w-100(@close="$router.push({hash: null})")
    section.pt-2rows
</template>

<script>
import OverlayHeader from '@/components/OverlayHeader'
export default {
  name: 'Cart',
  components: { OverlayHeader },
  beforeRouteLeave (to, from, next) {
    console.log('close')
    // if (!to) return this.$router.push('/')
    // return next()
  }
}
</script>
