<template lang="pug">
div
  video(:src="src", @click="play")
</template>

<script>
export default {
  name: 'CarouselVideo',
  props: ['src'],
  methods: {
    play (e) {
      const video = e.target
      if (!video) return false
      if (video.paused) return video.play()
      return video.pause()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../style/variables';

video{
  width:100%;
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
