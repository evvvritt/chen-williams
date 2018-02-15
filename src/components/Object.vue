<template lang="pug">
  article.object.overlay
    .object__body
      background
      overlay-header(@close="close")
      .object__main.pt-1row(v-if="object")
        .object__slideshow
          div
            figure
              img(src="../demo/CK-GEM_Pill_AB02.jpg")
            figure
              img(src="../demo/CK-GEM_Drum_P03.jpg")
            figure
              img(src="../demo/CK-GEM_Pen_P01.jpg")
        .object__details.p-text
          h1 {{object.data.title | text}}
          h6 {{object.data.year}}
          h6 {{object.data.dimensions | text}}
          div.mt1(v-html="richtext(object.data.description)")
          h6.mt1 Price
</template>

<script>
import Background from '@/components/DotGrid'
import OverlayHeader from '@/components/OverlayHeader'
import RadioBtn from '@/components/RadioBtn'
import scrollSnapPolyfill from 'css-scroll-snap-polyfill'
export default {
  name: 'Object',
  props: ['slug'],
  components: {
    Background,
    OverlayHeader,
    RadioBtn
  },
  data () {
    return {
      richtext: this.$options.filters.richtext
    }
  },
  computed: {
    object () {
      return this.$store.state.object
    }
  },
  methods: {
    close () {
      const route = this.$route.meta.closeTo ? {name: this.$route.meta.closeTo} : '/'
      this.$router.push(route)
    },
    getObject () {
      if (this.slug) this.$store.dispatch('getObject', this.slug)
    }
  },
  created () {
    this.getObject()
  },
  mounted () {
    scrollSnapPolyfill()
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
  .app-header{
    position: absolute;
    background:transparent;
  }
}
.object__body{
  position: relative;
  padding:$gutter;
  min-height:100vh;
}

.object__main{
  display: flex;
  flex-wrap: wrap;
  @media (min-width:769px) {
    flex-wrap: no-wrap;
  }
}
// column widths
.object__slideshow{
  flex:0 0 calc(100%/5 * 6);
  figure{
    width:calc(100%/6 * 5);
  }
  @media (min-width:769px) {
    flex:0 0 calc(100%/9 * 5);
    figure{
      width:calc(100%/5 * 4);
    }
  }
  @media (min-width:1441px) {
    flex:0 0 calc(100%/12 * 8);
    figure{
      width:calc(100%/8 * 7);
    }
  }
  @media (min-width:1900px) {
    flex:0 0 calc(100%/15 * 9);
    figure{
      width:calc(100%/9 * 8);
    }
  }
}
.object__details{
  flex:0 0 100%;
  @media (min-width:769px) {
    flex:0 0 calc(100%/9 * 4);
  }
  @media (min-width:1441px) {
    flex:0 0 calc(100%/12 * 4);
  }
  @media (min-width:1900px) {
    flex:0 0 calc(100%/15 * 6);
  }
}

.app-header{
  position: fixed;
  top:0; left:0;
  width:100%;
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
    img{
      width:100%;
    }
  }
}
</style>