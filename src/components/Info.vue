<template lang="pug">
  article.fixed.overlay.z-overlay.p2.bg-gray.backdrop-blur
    background(color="gray")
    overlay-header.absolute.top-0.left-0.w-100(@close="$router.push({hash: null})", title="Info")
    transition(name="fade")
      .pt-1row.flex.mbl-block.left-align(v-if="info")
        section.mb1
          div(v-html="$options.filters.richtext(info.main)")
        aside
          subscribe.mb2
          div(v-html="$options.filters.richtext(info.sidebar)")
</template>

<script>
import Background from '@/components/DotGrid'
import OverlayHeader from '@/components/OverlayHeader'
import Subscribe from '@/components/Subscribe'
export default {
  name: 'Info',
  components: { Background, OverlayHeader, Subscribe },
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

@include grid9 {
  section{
    flex:0 0 cols(5,9);
    div{ padding-right: 20%; }
  }
  aside{
    flex:0 0 cols(3,9);
  }
}

@include grid12 {
  section{
    flex:0 0 cols(5,12); 
  }
  aside{
    flex:0 0 cols(4,12); 
  }
}

@include grid15 {
  section{
    flex:0 0 cols(5,15);
  }
  aside{
    flex:0 0 cols(4,15);
  }
}
</style>
