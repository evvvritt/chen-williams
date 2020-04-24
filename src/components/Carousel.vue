<template lang="pug">
  .carousel(:class="{'carousel--invisible': !flkty, 'carousel--cursor-prev': cursorIsPrev}", @mousemove="onMousemove")
    //- slide
    figure.carousel-cell.mbl-relative(v-for="(slide, index) in slides", :class="{'figure--invisible': index > 0 && !firstSlideLoaded}")
      //- image
      template(v-if="slide.slice_type === 'image'")
        //- first two images, load src
        img.block(v-if="index < 2", :src="thumb(slide.primary.image.url)", :alt="slide.primary.image.alt", @load="index === 0 ? firstSlideLoaded = true : null", :class="{'img--portrait': imgIsPortrait(slide.primary.image.dimensions)}")
        //- lazyload later images
        img.block(v-else, :data-flickity-lazyload="thumb(slide.primary.image.url)", :alt="slide.primary.image.alt", :class="{'img--portrait': imgIsPortrait(slide.primary.image.dimensions)}")
      //- video
      template(v-if="slide.slice_type === 'video'")
        carousel-video(:src="slide.primary['video_' + videoSize].url", :poster="slide.primary.poster.url", :autoplay="index === 0", :isActive="flkty && flkty.selectedIndex ? index === flkty.selectedIndex : false")
</template>

<script>
import Vue from 'vue'
import Flickity from 'flickity-imagesloaded'
import CarouselVideo from '@/components/Carousel__Video'
import _throttle from 'lodash/throttle'
export default {
  name: 'Carousel',
  props: ['slides'],
  components: { CarouselVideo },
  data () {
    return {
      flkty: null,
      imgLength: window.innerWidth - 40,
      videoSize: window.innerWidth > 1024 ? '720' : '480',
      afterResize: null,
      firstSlideLoaded: false,
      nextPrevThreshold: 0.5,
      cursorIsPrev: false
    }
  },
  watch: {
    slides (slides) {
      this.firstSlideLoaded = false
      if (slides && slides[0] && slides[0].slice_type !== 'image') {
        this.firstSlideLoaded = true
      }
    }
  },
  methods: {
    initFlickity () {
      if (!this.flkty) {
        const delay = 0
        setTimeout(() => {
          // init
          this.flkty = new Flickity(this.$el, {
            lazyLoad: 2,
            cellAlign: 'left',
            imagesLoaded: true,
            pageDots: false,
            prevNextButtons: false,
            selectedAttraction: 0.02,
            friction: 0.28
          })
          // static click: next / prev, toggle video play
          this.flkty.on('staticClick', (event, pointer, cellElement, cellIndex) => {
            const el = event.target
            // ignore video btns
            if (el && el.tagName === 'DIV') return false
            // mobile
            if (Vue.is('mobile')) {
              // play / pause videos
              if (el && el.tagName === 'VIDEO') {
                if (el.paused) return el.play()
                return el.pause()
              }
            }
            // next / prev
            if (event.x < this.flkty.slider.offsetWidth * this.nextPrevThreshold) {
              return this.flkty.previous()
            }
            return this.flkty.next()
          })
        }, delay)
      }
    },
    thumb (src) {
      if (!src) return false
      const useHeight = window.innerWidth > 768
      return Vue.thumbSrc(src, this.imgLength, useHeight)
    },
    imgIsPortrait (dims) {
      return dims && dims.width && dims.height && dims.width < dims.height
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
      this.afterResize = setTimeout(this.setImgLength, 500)
    },
    onMousemove: _throttle(function (event) {
      if (event.x < this.$el.offsetWidth * this.nextPrevThreshold) {
        this.cursorIsPrev = true; return
      }
      this.cursorIsPrev = false
    }, 50)
  },
  created () {
    this.setImgLength()
    window.addEventListener('resize', this.onResize)
  },
  mounted () {
    this.initFlickity()
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
  // cursor
  cursor:e-resize;
  &.carousel--cursor-prev{
    cursor:w-resize;
  }
}

// mobile
figure{
  width:calc(100%/6 * 5);
  height:0;
  padding-bottom:calc(100%/6 * 5);
  transition: opacity 500ms;

  &.figure--invisible{
    opacity:0;
  }

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

.img--portrait{
  position: absolute;
  left:0; top:0;
  width:auto;
  height:100%;
}

// above mobile
@include grid9 {
  figure{
    width:auto;
    height:auto;
    padding-bottom: 0;
    img, img.img--portrait{
      position: static;
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