<template lang="pug">
  article.fixed.overlay.z-overlay.p2.bg-gray.backdrop-blur
    overlay-header.absolute.top-0.left-0.w-100(@close="$router.push({hash: null})")
    section.pt-2rows.sm-flex.justify-between.left-align
      div.item-fill
        div Chen Chen & Kai Williams...
      aside.item-fill
        div GENERAL INQUIRIES<br>info@chen-williams.com
</template>

<script>
import OverlayHeader from '@/components/OverlayHeader'
export default {
  name: 'Info',
  components: { OverlayHeader }
}
</script>

<style lang="scss" scoped>
@import '../style/variables';
</style>