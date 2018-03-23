<template lang="pug">
.video-player.relative(:class="{'video-player--controls': showControlsAlways}")
  div.absolute.bottom-0.left-0.p1.z1.pointer(@click="isPlaying ? pause() : play()")
    div.video-icon(:class="{'video-icon--play': !isPlaying, 'video-icon--pause': isPlaying}") 
  div.absolute.bottom-0.right-0.p1.z1.pointer(@click="isMuted = !isMuted")
    div.video-icon(:class="{'video-icon--mute': !isMuted, 'video-icon--unmute': isMuted}")
  video.pointer(ref="video", :src="src", :poster="poster", @playing="isPlaying = true", @pause="isPlaying = false", @ended="isPlaying = false", playsinline, :muted="isMuted", @canplay="beginAutoplay")
</template>

<script>
export default {
  name: 'CarouselVideo',
  props: {
    src: { type: String, default: '' },
    poster: { type: String, default: '' },
    autoplay: { type: Boolean, default: false },
    isActive: { type: Boolean, default: false }
  },
  data () {
    return {
      showControlsAlways: false,
      isPlaying: false,
      isMuted: true
    }
  },
  watch: {
    isActive () {
      if (this.isActive) return this.play()
      return this.pause()
    }
  },
  methods: {
    beginAutoplay () {
      if (this.autoplay) {
        const promise = this.play()
        if (promise) {
          promise.catch(error => {
            console.error('Autoplay videos not allowed', error)
            this.showControlsAlways = true
          })
        }
      }
    },
    play () {
      if (this.$refs.video.paused) this.$refs.video.play()
    },
    pause () {
      this.$refs.video.pause()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../style/variables';

video{
  width:100%;
}

.video-icon{
  display: block;
  cursor: pointer;
  width:$radioBtnSize;
  height:$radioBtnSize;
  background-repeat:no-repeat;
  background-size:contain;
  &.video-icon--play{
    background-image:url('../assets/icons/play-icon.svg');
  }
  &.video-icon--pause{
    background-image:url('../assets/icons/pause-icon.svg');
  }
  &.video-icon--mute{
    background-image:url('../assets/icons/muted-icon.svg');
    .no-touchevents &:hover{
      // background-image:url('../assets/icons/muted-icon.svg');  
    }
  }
  &.video-icon--unmute{
    background-image:url('../assets/icons/sound-icon.svg');
    .no-touchevents &:hover{
      // background-image:url('../assets/icons/sound-icon.svg');  
    }
  }

  .no-touchevents .video-player:not(.video-player--controls) &{
    transition: opacity 400ms;
    opacity:0;
  }
  .no-touchevents .video-player:hover &{
    opacity:1;
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
