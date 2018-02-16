<template lang="pug">
  .carousel(:class="{'carousel--invisible': !flkty}")
    figure
      img.block(src="../demo/CK-GEM_Hook1_02.jpg")
    figure
      img.block(src="../demo/CK-GEM_Drum_P03.jpg")
    figure
      img.block(src="../demo/CK-GEM_Pen_P01.jpg")
</template>

<script>
import Flickity from 'flickity-imagesloaded'
export default {
  name: 'Carousel',
  data () {
    return {
      flkty: null
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
            if (event.x < this.slider.offsetWidth * 0.5) return this.previous()
            return this.next(true)
          })
        }, delay)
      }
    }
  },
  mounted () {
    this.init()
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
      height:calc((100vw - 4rem)/9 * 4);
    }
  }
}
@include grid12{
  img{
    height:calc((100vw - 4rem)/12 * 4);
  }
}
@include grid15{
  img{
    height:calc((100vw - 4rem)/15 * 4);
  }
}
</style>