<template lang="pug">
  article.fixed.overlay.z-overlay.p2.bg-gray.backdrop-blur
    overlay-header.absolute.top-0.left-0.w-100(@close="$router.push({hash: null})")
    section.pt-2rows.sm-flex.justify-between.left-align(v-if="info")
      div.item-fill
        div(v-html="$options.filters.richtext(info.main)")
      aside.item-fill
        div(v-html="$options.filters.richtext(info.sidebar)")
</template>

<script>
import OverlayHeader from '@/components/OverlayHeader'
export default {
  name: 'Info',
  components: { OverlayHeader },
  computed: {
    info () {
      return this.$store.state.info
    }
  },
  beforeCreate () {
    this.$store.dispatch('getInfo')
  }
}
</script>

<style lang="scss" scoped>
@import '../style/variables';
</style>