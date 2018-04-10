<template lang="pug">
  #app.app(:class="{'app--loading': loading}")
    .app__body(:class="{'app__body--blurred': blurBody}")
      app-header#app-header.fixed.top-0.left-0.w-100.z-nav
      .app__body__main.min-h-100vh
        router-view
    transition(name="slideup")
      info(v-if="showInfo")
    transition(name="slideup")
      cart(v-show="showCart")
</template>

<script>
import Vue from 'vue'
import { mapState, mapActions } from 'vuex'
import AppHeader from '@/components/Header/Index'
import Info from '@/components/Info'
import Cart from '@/components/Cart'
export default {
  name: 'app',
  components: { AppHeader, Info, Cart },
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
    site () {
      this.redirect()
    },
    '$route' (to, from) {
      if (to.name === 'Home') return this.redirect()
    }
  },
  methods: {
    ...mapActions([
      'getSite',
      'getProducts',
      'createCheckout'
    ]),
    redirect () {
      if (this.site.nav && this.$route.name === 'Home') {
        const slug = this.site.nav[0].primary.category_link.uid
        this.$router.replace({name: 'Category', params: {catSlug: slug}})
      }
    },
    load () {
      let canFinish = false
      const minWait = Vue.config.productionTip ? 1500 : 1500
      const finish = () => this.$store.commit('loading', false)
      // get site
      this.getSite().then(() => {
        if (canFinish) finish()
      }, (err) => {
        console.error(err)
        finish()
      })
      // minimum wait
      setTimeout(() => {
        canFinish = true
        if (this.site) finish()
      }, minWait)
    }
  },
  created () {
    this.load()
    this.createCheckout()
    this.getProducts()
  }
}
</script>

<style src="../node_modules/flickity/dist/flickity.css"></style>
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

  p + p{
    margin-top: 1em;
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

// transitions

.app{
  .fade-enter-active,
  .fade-leave-active{
    transition: opacity $fadeDuration;
  }
  .fade-enter,
  .fade-leave-to{
    opacity:0;
  }
  .quickfade-enter-active,
  .quickfade-leave-active{
    transition: opacity $fadeDuration/2;
  }
  .quickfade-enter,
  .quickfade-leave-to{
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
