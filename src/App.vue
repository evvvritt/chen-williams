<template lang="pug">
  #app.app(:class="{'app--loading': loading}")
    app-header.app__header(:loading="loading")
    .app__body
      router-view(:loading="loading")
</template>

<script>
import AppHeader from '@/components/Header'
import DotGrid from '@/components/DotGrid'
export default {
  name: 'app',
  components: {
    AppHeader,
    DotGrid
  },
  data () {
    return {
      loading: true
    }
  },
  mounted () {
    setTimeout(() => { this.loading = false }, 2500)
  }
}
</script>

<style lang="scss">
@import './style/variables';

*{
  &, &:after, &:before{
    margin:0;
    padding:0;
    box-sizing:border-box;
    border-width:1px;
    border-color:$black;  
  }
}

html{
  font-size:$rem;
  background:$white;
}

h1,h2,h3,h4,h5,h6,small{
  font-weight: inherit;
  font-size:inherit;
}

.app{
  font-size:$basefont;
  font-family: 'Plain', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

  a{
    &, &:link, &:visited{
      color:inherit;
      text-decoration: none;
    }
  }

  img{
    max-width:100%;
  }

  .left-align{
    text-align: left;
  }

  .is-overlay{
    top:0; left:0; right:0; bottom:0;
  }

  .text-pad{
    padding:10px 5px;
  }
}

.app__header{
  position: fixed;
  top:0; left:0;
  width:100%;
  z-index:10;
}

.app__body{
  // position: relative;
  // z-index:1;
  min-height:100vh;
}

// transitions

.app{
  .fadeinplace-enter-active,
  .fadeinplace-leave-active{
    transition: opacity $fadeDuration;
  }
  .fadeinplace-enter,
  .fadeinplace-leave-to{
    opacity:0;
  }

  .overlay-enter-active,
  .overlay-leave-active{
    transition: opacity 200ms;
  }
  .overlay-enter,
  .overlay-leave-to{
    opacity:0;
  }
}
</style>
