<template lang="pug">
  article.object.is-overlay
    .object__body
      background
      header.app-header
        //- background(:rows="2", :overlay="false")
        nav.nav
          ul.cw-grid
            li.cw-grid__item
              router-link(to="/")
                img(src='../assets/logo.svg')
            li.cw-grid__item
              router-link(:to="closeTo").nav__link Close
              router-link(:to="closeTo")
                radio-btn
      .object__main.pt-1row
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
// import MainContent from '@/components/MainBody'
import RadioBtn from '@/components/RadioBtn'
import scrollSnapPolyfill from 'css-scroll-snap-polyfill'
export default {
  name: 'Object',
  components: {
    Background,
    RadioBtn
  },
  computed: {
    closeTo () {
      return this.$route.meta.closeTo ? {name: this.$route.meta.closeTo} : '/'
    }
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