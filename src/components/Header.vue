<template lang="pug">
  header.app-header(:class="{'app-header--condensed': condensed}")
    dot-grid(:rows="2", :overlay="false", :condensed="condensed")
    nav.nav
      ul.nav__primary-nav.cw-grid(:class="{'cw-grid--condensed': condensed}")
        router-link(tag="li", to="/").cw-grid__item
          a
            img(src='../assets/logo.svg')
        router-link(tag="li", :to="{name: 'Shop'}").cw-grid__item
          a.nav__link(v-if="!loading") Shop
          span.nav__link(v-else) Loading
          a
            radio-btn(:checked="loading")
          .nav__vein
        router-link(tag="li", :to="{name: 'Furniture'}").cw-grid__item
          a.nav__link Furniture
          a <radio-btn />
          .nav__vein
        router-link(tag="li", :to="{name: 'Projects'}").cw-grid__item
          a.nav__link Projects
          a <radio-btn />
          .nav__vein
        router-link(tag="li", :to="{name: 'Page', params: {slug: 'info'}}").cw-grid__item
          a.nav__link Info
          a <radio-btn />
        transition(name="fadeinplace")
          li.cw-grid__item(v-show="!loading")
            a(target="_blank", rel="noopener").nav__link Archive
            a(target="_blank", rel="noopener") <radio-btn />
        transition(name="fadeinplace")
          router-link(tag="li", :to="{hash: 'cart'}").cw-grid__item(v-show="!loading")
            a(v-show="!loading").nav__link Cart
            a <radio-btn />
      //- shop nav
      transition(name="fadeinplace")
        ul.nav__subnav.cw-grid(v-show="!loading", :class="{'cw-grid--condensed': condensed}")
          router-link(tag="li", :to="{name: 'Shop'}").cw-grid__item
            a.nav__link Everything
            a <radio-btn />
            .nav__vein
          li.cw-grid__item
            a(@click="filter('Home')").nav__link Home
            a(@click="filter('Home')")
              radio-btn(:checked="isActive('Home')")
            .nav__vein
          li.cw-grid__item
            a(@click="filter('Body')").nav__link Body
            a(@click="filter('Body')")
              radio-btn(:checked="isActive('Body')")
            .nav__vein
          li.cw-grid__item
            a(@click="filter('One Off')").nav__link One Off
            a(@click="filter('One Off')")
              radio-btn(:checked="isActive('One Off')")
            .nav__vein
          li.cw-grid__item
            router-link(:to="{name: 'Partners'}").nav__link Partners
            router-link(:to="{name: 'Partners'}")
              radio-btn
</template>

<script>
import DotGrid from '@/components/DotGrid'
import RadioBtn from '@/components/RadioBtn'
import _kebab from 'lodash/kebabCase'
import _throttle from 'lodash/throttle'
export default {
  name: 'Header',
  props: ['loading'],
  components: {
    DotGrid,
    RadioBtn
  },
  data () {
    return {
      condensed: false
    }
  },
  computed: {
    activeCategories () {
      const cats = this.$route.query.categories
      if (cats) return cats.split(',')
      return []
    }
  },
  watch: {
    '$route' (to, from) {
      this.bindScroll(false)
      if (this.$route.meta.isOverlay !== true) this.bindScroll()
    }
  },
  methods: {
    isActive (filter) {
      if (!filter) return false
      return this.activeCategories.indexOf(_kebab(filter)) > -1
    },
    filter (category) {
      if (!category) return false
      const cat = _kebab(category)
      let cats = this.$route.query.categories // empty object || string
      if (!cats || cats.length === 0) return this.$router.replace({query: {categories: cat}})
      // otherwise add/remove
      cats = cats.split(',')
      const index = cats.indexOf(cat)
      if (index > -1) {
        cats.splice(index, 1)
        if (cats.length === 0) return this.$router.replace({query: null})
      } else {
        cats.push(cat)
      }
      cats = cats.join(',')
      this.$router.replace({query: {categories: cats}})
    },
    onScroll: _throttle(function () {
      this.condensed = window.pageYOffset > 2
    }, 100),
    bindScroll (bind = true) {
      if (!bind) return window.removeEventListener('scroll', this.onScroll)
      return window.addEventListener('scroll', this.onScroll)
    }
  },
  mounted () {
    this.bindScroll()
  },
  destroyed () {
    this.bindScroll(false)
  }
}
</script>

<style lang="scss">
@import '../style/variables';

.app-header{
  background:rgba($white, .8);
  padding-bottom: 1px;
  backdrop-filter:blur(10px);
}

.nav{
  padding:calc(25vh + #{$gutter}) $gutter 0;
  position: relative;
  margin-top: -25vh;
  transition:box-shadow $navCondenseDuration;
  .app-header--condensed &{
    box-shadow: 0 0 50px -20px #000000;
  }

  > ul{
    list-style-type: none;
    text-align: left;
    > li{
      position: relative;
      height:0;
      transition:padding-bottom $navCondenseDuration;

      img{
        width:50%;
        position: absolute;
        top:rem(-6px); left:rem(-6px);
        // transform:translateX(rem(-6px)) translateY(rem(-6px));
        transition: transform $navCondenseDuration;
        transform-origin:top left;
      }
      
      .app-header--condensed &{
        img{
          transform:scale(0.66,0.66);
        }
      }
      
      .app--loading &{
        $cycle: 5000ms;
        $steps: 4;
        $pace: ($cycle/2/$steps);
        &:nth-child(2) .radio-btn{
          opacity:0;
          animation:pulse_p $cycle 0s infinite;
        }
        &:nth-child(3) .radio-btn{
          opacity:0;
          animation:pulse_p $cycle $pace infinite;
        }
        &:nth-child(4) .radio-btn{
          opacity:0;
          animation:pulse_p $cycle $pace*2 infinite;
        }    
        &:nth-child(5) .radio-btn{
          opacity:0;
          animation:pulse_p $cycle $pace*3 infinite;
        }    
      }
    }
  }
}

.nav__link{
  cursor: pointer;
  position: absolute;
  top: 0; left:-0.5em;
  padding: 1.15em 0.5em 0;
  transition:opacity $fadeDuration;
  z-index:1;
  .app--loading &:not(span){
    opacity:0;
    visibility:hidden;
  }
}

.nav .radio-btn{
  // display:block;
  position: absolute;
  left: rem(-8px);
  top: rem(-8px);
  // width:rem(16px);
  // height:rem(16px);
  z-index:2;
  // background-image:url(../assets/icons/radio-btn.svg);
  // background-size:contain;  
  // background-repeat:no-repeat;
  transition: opacity $fadeDuration;
  .app--loading &{
    transition:none;
  }
  // radio bullet
  .nav__primary-nav &.router-link-active,
  .nav__subnav &.router-link-exact-active,
  &.nav__radio-btn--selected{
    background-image:url(../assets/icons/radio-btn--selected.svg);
  }
  .app--loading &.router-link-active:not(.nav__radio-btn--selected){
    background-image:url(../assets/icons/radio-btn.svg);
  }
}

.nav__vein{
  opacity:0;
  position: absolute;
  z-index:-1;
  border-width:1px;
  .nav__primary-nav .router-link-active &{
    opacity:1;
    left:-1px;
    top:3em;
    border-left-style:solid;
    height:calc(100% - 3em - 16px);
  }
  .nav__subnav &{
    opacity:1;
    top: -1px;
    left:16px;
    width:calc(100% - 32px);
    border-top-style: solid;
  }
  .app--loading &{
    opacity:0 !important;
  }
}

@keyframes pulse_p{
  0%{
    opacity:0;
  }
  5%{
    opacity:1;
  }
  55%{
    opacity:1
  }
  60%{
    opacity:0;
  }
}
</style>