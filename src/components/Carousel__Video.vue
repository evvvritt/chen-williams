<template lang="pug">
div.relative
  span.absolute.bottom-0.left-0.p1.z1.pointer-events-none(v-show="!isPlaying")
  video.pointer(:src="src", :poster="poster", @playing="isPlaying = true", @pause="isPlaying = false", @ended="isPlaying = false", playsinline)
</template>

<script>
export default {
  name: 'CarouselVideo',
  props: ['src', 'poster'],
  data () {
    return {
      isPlaying: false
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

@include grid15 {
  div{
    max-width:calc((100vw - #{$gutter} * 2)/15 * 6);
  }
  video{
    height:calc((100vw - #{$gutter} * 2)/15 * 4);
  }
}
</style>
