<template lang="pug">
div.relative.pointer(@click.stop="play = !play")
  span.absolute.bottom-0.left-0.p1.z1(v-show="!play")
  video(:src="src", @ended="play = false")
</template>

<script>
export default {
  name: 'CarouselVideo',
  props: ['src'],
  data () {
    return {
      play: false
    }
  },
  watch: {
    play (play) {
      const video = this.$el.querySelector('video')
      if (!video) {
        this.play = false
      } else if (play && video.paused) {
        video.play()
      } else {
        video.pause()
      }
    }
  },
  methods: {
    pause () {
      // for calling from parent
      this.play = false
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../style/variables';

video{
  width:100%;
}

span{
  &:after{
    content:'';
    display: block;
    width:24px;
    height:24px;
    background-repeat:no-repeat;
    background-size:contain;
    background-image:url('../assets/icons/play-icon.svg');
  }
}

@include grid9 {
  div{
    max-width:calc((100vw - #{$gutter} * 2)/9 * 6);
    overflow:hidden;
    display:flex;
    justify-content: center;
  }
  video{
    width:auto;
    height:calc((100vw - #{$gutter} * 2)/9 * 4);
  }
}

@include grid12 {
  div{
    max-width:calc((100vw - #{$gutter} * 2)/12 * 6);
  }
  video{
    height:calc((100vw - #{$gutter} * 2)/12 * 4);
  }
}

@include grid12 {
  div{
    max-width:calc((100vw - #{$gutter} * 2)/15 * 6);
  }
  video{
    height:calc((100vw - #{$gutter} * 2)/15 * 4);
  }
}
</style>
