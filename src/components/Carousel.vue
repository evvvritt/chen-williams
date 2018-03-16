<template lang="pug">
  .carousel(:class="{'carousel--invisible': !flkty}")
    figure(v-for="(slide, index) in slides")
      template(v-if="slide.slice_type === 'image'")
        img.block(v-if="index < 2", :src="thumb(slide.primary.image.url)")
        img.block(v-else, :data-flickity-lazyload="thumb(slide.primary.image.url)")
      template(v-if="slide.slice_type === 'video'")
        carousel-video(:src="slide.primary['video_' + videoSize].url", :poster="slide.primary.poster.url", :autoplay="index === 0", :isActive="flkty && flkty.selectedIndex ? index === flkty.selectedIndex : false")
</template>

<script>
import Vue from 'vue'
import Flickity from 'flickity-imagesloaded'
import CarouselVideo from '@/components/Carousel__Video'
export default {
  name: 'Carousel',
  props: ['slides'],
  components: { CarouselVideo },
  data () {
    return {
      flkty: null,
      imgLength: window.innerWidth - 40,
      videoSize: window.innerWidth > 1024 ? '720' : '480',
      afterResize: null
    }
  },
  methods: {
    init () {
      if (!this.flkty) {
        const delay = 0
        setTimeout(() => {
          // init
          this.flkty = new Flickity(this.$el, {
            cellSelector: 'figure',
            lazyLoad: 2,
            cellAlign: 'left',
            imagesLoaded: true,
            pageDots: false,
            prevNextButtons: false,
            selectedAttraction: 0.02,
            friction: 0.28
          })
          // static click: next / prev
          this.flkty.on('staticClick', function (event, pointer, cellElement, cellIndex) {
            // next/prev
            if (event.x < this.slider.offsetWidth * 0.5) return this.previous()
            return this.next(true)
          })
        }, delay)
      }
    },
    thumb (src) {
      if (!src) return false
      const lengthIsHeight = window.innerWidth > 768
      return Vue.thumbSrc(src, this.imgLength, lengthIsHeight)
    },
    setImgLength () {
      const winW = window.innerWidth
      let length = this.imgLength
      if (winW > 768) length = winW / 9 * 4
      if (winW > 1440) length = winW / 12 * 4
      if (winW > 1900) length = winW / 15 * 4
      this.imgLength = parseInt(length)
    },
    onResize () {
      clearTimeout(this.afterResize)
      this.afterResize = setTimeout(() => {
        this.setImgLength()
      }, 500)
    }
  },
  created () {
    this.setImgLength()
    window.addEventListener('resize', this.onResize)
  },
  mounted () {
    this.init()
  },
  destroyed () {
    window.removeEventListener('resize', this.onResize)
  }
}
</script>

<style lang="scss" scoped>
@import '../style/variables';

.carousel{
  transition:opacity 500ms;
  &.carousel--invisible{
   opacity:0;
  }
  &:focus{
    outline:none;
  }
}

// mobile
figure{
  width:calc(100%/6 * 5);
  img{
    width:100%;
    max-width:none;
  }
  video{
    width:100%;
  }
  // opacity
  opacity:.4;
  transition: opacity 500ms;
  &.is-selected,
  &:hover{
    opacity:1;
  }
  // close 1px gap
  z-index:2;
  &.is-selected + figure{
    transform:translateX(-1px); 
    z-index:1; 
  }
}
// after mobile
@include grid9 {
  figure{
    width:auto;
    img{
      width:auto;
      height:calc((100vw - #{$gutter} * 2)/9 * 4);
    }
  }
}
@include grid12{
  figure img{
    height:calc((100vw - #{$gutter} * 2)/12 * 4);
  }
}
@include grid15{
  figure img{
    height:calc((100vw - #{$gutter} * 2)/15 * 4);
  }
}
</style>