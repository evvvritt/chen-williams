<template lang="pug">
  article.fixed.overlay.z-overlay.p2
    overlay-header.absolute.top-0.left-0.w-100
    .pt-2rows.sm-flex.justify-between.left-align
      section.item-fill
        div Chen Chen & Kai Williams...
      aside.item-fill
        div GENERAL INQUIRIES<br>info@chen-williams.com
</template>

<script>
import OverlayHeader from '@/components/OverlayHeader'
export default {
  name: 'Info',
  components: { OverlayHeader },
  data () {
    return {

    }
  }
}
</script>

<style lang="scss" scoped>
@import '../style/variables';
article{
  background:rgba($ltgray, .2);
  @supports (backdrop-filter:blur(10px)){
    backdrop-filter:blur(10px);
  }
}
</style>