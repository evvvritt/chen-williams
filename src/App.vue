<template lang="pug">
  #app.app(:class="{'app--loading': loading}")
    .app__body(:class="{'app__body--blurred': blurBody}")
      app-header#app-header.fixed.top-0.left-0.w-100.z-nav.backdrop-blur(:loading="loading")
      .app__body__main
        router-view(:loading="loading")
    transition(name="slideup")
      info(v-if="showInfo")
    transition(name="slideup")
      cart(v-show="showCart")
</template>

<script>
import { mapState, mapActions } from 'vuex'
import AppHeader from '@/components/Header'
import DotGrid from '@/components/DotGrid'
import Info from '@/components/Info'
import Cart from '@/components/Cart'
export default {
  name: 'app',
  components: {
    AppHeader,
    DotGrid,
    Info,
    Cart
  },
  computed: {
    ...mapState([
      'site',
      'loading'
    ]),
    showInfo () {
      return this.$route.hash === '#info' && !this.loading
    },
    showCart () {
      return this.$route.hash === '#cart' && !this.loading
    },
    blurBody () {
      return this.showInfo || this.showCart
    }
  },
  watch: {
    site (site) {
      if (site.nav && this.$route.name === 'Home') {
        this.$router.push({name: 'Category', params: {category: site.nav[0].link.uid}})
      }
    }
  },
  methods: {
    ...mapActions([
      'getSite'
    ])
  },
  created () {
    this.getSite()
  }
}
</script>

<style lang="scss">
@import './style/variables';
@import './style/atomic';

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
}

.app__body{
  @supports not (backdrop-filter:blur(10px)) {
    transition: filter $fadeDuration/2;
    &.app__body--blurred{
      filter:blur(10px);
    }  
  }
}

#app-header{
  background:rgba($white, .8);
  
}

.app__body__main{
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

  .slideup-enter-active,
  .slideup-leave-active{
    transition: transform 500ms;
  }
  .slideup-enter,
  .slideup-leave-to{
    transform:translateY(100%);
  }
}
</style>
