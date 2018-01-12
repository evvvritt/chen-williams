<template lang="pug">
  #app.app(:class="{'app--loading': loading}")
    app-header.app__header(:loading="loading")
    .app__body
      dot-grid
      router-view
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
    setTimeout(() => { this.loading = false }, 1000)
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

.app{
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
}

.app__header{
  position: fixed;
  top:0; left:0;
  width:100%;
  z-index:10;
}

.app__body{
  position: relative;
  z-index:1;
  min-height:200vh;
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
}
</style>
