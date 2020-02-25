<template lang="pug">
  header#app-header
    header-body#app-header__body.fixed.top-0.left-0.w-100.z-nav(:condensed="condensed")
    header-bg#app-header__bg.fixed.top-0.left-0.w-100.z-nav.z-nav-bg(:class="{'app-header__bg--condensed backdrop-blur': condensed}")
</template>

<script>
import HeaderBody from './HeaderBody'
import HeaderBg from './HeaderBg'
import _throttle from 'lodash/throttle'
export default {
  name: 'Header',
  components: { HeaderBody, HeaderBg },
  data () {
    return {
      condensed: false
    }
  },
  watch: {
    '$route' (to, from) {
      // unbind
      this.bindScroll(false)
      // re-bind if not overlay
      const isOverlay = to.hash === '#info' || to.hash === '#cart' || this.$route.meta.isOverlay
      this.$nextTick(() => this.bindScroll(!isOverlay))
    }
  },
  methods: {
    onScroll: _throttle(function () {
      if (window.pageYOffset > 2) this.condensed = true
      else this.condensed = false
    }, 50),
    bindScroll (bind = true) {
      if (!bind) return window.removeEventListener('scroll', this.onScroll)
      return window.addEventListener('scroll', this.onScroll)
    }
  },
  mounted () {
    this.bindScroll()
  },
  destroyed () {
    this.bindScroll(false)
  }
}
</script>

<style lang="scss">
@import '../../style/variables';

#app-header__bg{
  transition:opacity $navCondenseDuration, transform $navCondenseDuration;
  opacity:0;
  will-change: backdrop-filter;
  &.app-header__bg--condensed {
    opacity:1;
    transition:opacity $navCondenseDuration, transform $navCondenseDuration, backdrop-filter $navCondenseDuration $navCondenseDuration*1.05;
    
    // condense 25%
    @media (min-width:$bkpt-navCondense-25) {
      transform:translateY(calc(-1 * (100% - #{$gutter}) / 4));
    }
    // condense 50%
    @media (min-width:$bkpt-navCondense-50) {
      transform:translateY(calc(-1 * (100% - #{$gutter}) / 2));
    }
  }
}

@include mobile {
  #app-header__body{
    max-height:100vh;
    overflow-y:auto;
  }
}

</style>
