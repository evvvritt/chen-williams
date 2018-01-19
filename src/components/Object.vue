<template lang="pug">
  article.object.is-overlay
    .object__body
      background
      header.app-header(:class="{'app-header--condensed': condensed}")
        background(:rows="2", :overlay="false", :condensed="condensed")
        nav.nav
          ul.cw-grid
            li.cw-grid__item
              router-link(to="/")
                img(src='../assets/logo.svg')
            li.cw-grid__item
              router-link(:to="closeTo")
                radio-btn
              router-link(:to="closeTo").nav__link Close
      main-content
        .object__slideshow
          div
            figure
              img(src="../demo/CK-GEM_Pill_AB02.jpg")
            figure
              img(src="../demo/CK-GEM_Drum_P03.jpg")
            figure
              img(src="../demo/CK-GEM_Pen_P01.jpg")
        .object__details.text-pad
          | Name
          br
          | Design Year
          br
          | Dimensions
          br
          br
          | Description
          br
          br
          | Material
          br
          br
          | Price
</template>

<script>
import Background from '@/components/DotGrid'
import MainContent from '@/components/MainBody'
import RadioBtn from '@/components/RadioBtn'
import _throttle from 'lodash/throttle'
import scrollSnapPolyfill from 'css-scroll-snap-polyfill'
export default {
  name: 'Object',
  components: {
    Background,
    MainContent,
    RadioBtn
  },
  data () {
    return {
      condensed: false
    }
  },
  computed: {
    closeTo () {
      return this.$route.meta.closeTo ? {name: this.$route.meta.closeTo} : '/'
    }
  },
  methods: {
    onScroll: _throttle(function () {
      this.condensed = this.$el.scrollTop > 2
    }, 100)
  },
  mounted () {
    scrollSnapPolyfill()
    this.$el.addEventListener('scroll', this.onScroll)
  },
  destroyed () {
    this.$el.removeEventListener('scroll', this.onScroll)
  }
}
</script>

<style lang="scss" scoped>
@import '../style/variables';

.object{
  position: fixed;
  width:100%;
  height:100%;
  overflow-x:hidden;
  overflow-y:auto;
  z-index: $z-overlay;
  background:$white;
}
.object__body{
  position: relative;
  padding:$gutter;
}

.app-header{
  position: fixed;
  top:0; left:0;
  width:100%;
}

.main-content{
  display: flex;
  .object__slideshow{
    flex:0 0 calc(100%/9 * 6);
  }
  .object__details{
    flex:0 0 calc(100%/9 * 3);
  }
}

.object__slideshow{
  overflow:auto;
  overflow-y:hidden;
  scroll-snap-type: proximity;
  > div{
    width:auto;
    white-space:nowrap;
  }
  figure{
    scroll-snap-align: start;
    display: inline-block;
    width:calc(100%/6 * 5);
  }
}
</style>