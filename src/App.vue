<template lang="pug">
  #app.app(:class="classes")
    .app__body(:class="{'app__body--blurred': blurBody}")
      app-header
      //- #app-header.fixed.top-0.left-0.w-100.z-nav
      //- background
      //- #nav__bg.fixed.overlay.top-0.backdrop-blur
        #nav__bg__fill.absolute.overlay
        .absolute.left-0.bottom-0.w-100.px2.mbl-hidden
          .relative
            //- dot-grid(:rows="1", :overlay="false", :padless="true", :keepFirstDot="true")
      .app__body__main.min-h-100vh
        router-view
    //- info
    transition(name="slideup")
      info(v-if="showInfo")
    //- cart
    transition(name="slideup")
      cart(v-show="showCart", :visible="showCart")
    //- mobile logo
    logo.tblt-hidden
    //- coupon button
    transition(name="hidden-on-overlays")
      coupon-btn.fixed.bottom-0.right-0.p2.z2(v-show="showCouponBtn")
</template>

<script>
import Vue from 'vue'
import { mapState, mapActions } from 'vuex'
import AppHeader from '@/components/Header/Index'
import Info from '@/components/Info'
import Cart from '@/components/Cart'
import CouponBtn from '@/components/CouponBtn'
import Logo from '@/components/Header/NavLogo.vue'
export default {
  name: 'app',
  components: { AppHeader, Info, Cart, CouponBtn, Logo },
  data () {
    return {
      blurEnabled: window.navigator.userAgent.indexOf('Firefox') === -1,
      cartIsVisible: false
    }
  },
  computed: {
    ...mapState([
      'site',
      'loading'
    ]),
    classes () {
      return {
        'app--loading': this.loading,
        'app--blur-enabled': this.blurEnabled
      }
    },
    showInfo () {
      return this.$route.hash === '#info' && !this.loading
    },
    showCart () {
      return this.$route.hash === '#cart' && !this.loading
    },
    blurBody () {
      return this.showInfo || this.showCart
    },
    showCouponBtn () {
      return !this.loading && this.site && this.site.show_coupon_button === 'true' && !this.showCart && !this.showInfo
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
      const minWait = Vue.config.productionTip ? 2000 : 2000
      const finish = () => this.$store.commit('loading', false)
      // request
      this.getSite()
      // minimum wait
      setTimeout(() => {
        canFinish = true
        if (this.site) finish()
      }, minWait)
      // finish if min wait reached
      const unwatch = this.$watch('site', () => {
        unwatch() // remove watcher
        if (canFinish) finish()
      })
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
@import './style/fonts';
@import './style/atomic';

*{
  &, &:after, &:before{
    margin:0;
    padding:0;
    box-sizing:border-box;
    border-width:1px;
    border-color:$black;
    // -webkit-backface-visibility:hidden;
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
  font-family: 'PlainRegular', Arial, sans-serif;
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
    $speed: $fadeDuration/2;
    // default: fade out
    transition: opacity $speed;
    #app-header__desktop-logo{ transition: opacity $speed; }
    &.app__body--blurred{
      opacity: .125;
      #app-header__desktop-logo{ opacity: 0 }
    }
    // blur, if enabled
    .app--blur-enabled & {
      transition: filter $speed;
      &.app__body--blurred{
        filter:blur(10px);
        opacity:1;
      }    
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

  .hidden-on-overlays-enter-active{
    transition:opacity 500ms 500ms;
  }
  .hidden-on-overlays-leave-active{
    transition:opacity 0s;
  }
  .hidden-on-overlays-enter,
  .hidden-on-overlays-leave-to{
    opacity:0;
  }
}
</style>
