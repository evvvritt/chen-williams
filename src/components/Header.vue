<template lang="pug">
  header(:class="{'header--condensed': condensed}")
    dot-grid(:rows="2", :overlay="false", :condensed="condensed")
    nav
      ul.nav__primary-nav
        li
          router-link(to="/")
            img(src='../assets/logo.svg')
        li
          router-link(:to="{name: 'Shop'}", :class="{'nav__radio-btn--selected': loading}").nav__radio-btn
          router-link(:to="{name: 'Shop'}", v-if="!loading").nav__link Shop
          span(v-else).nav__link Loading
        li
          router-link(:to="{name: 'Furniture'}").nav__radio-btn
          router-link(:to="{name: 'Furniture'}").nav__link Furniture
        li
          router-link(:to="{name: 'Projects'}").nav__radio-btn
          router-link(:to="{name: 'Projects'}").nav__link Projects
        li
          router-link(:to="{name: 'Page', params: {slug: 'info'}}").nav__radio-btn
          router-link(:to="{name: 'Page', params: {slug: 'info'}}").nav__link Info
        transition(name="fadeinplace")
          li(v-show="!loading")
            a(target="_blank", rel="noopener").nav__radio-btn
            a(target="_blank", rel="noopener").nav__link Archive
        transition(name="fadeinplace")
          li(v-show="!loading")
            router-link(:to="{hash: 'cart'}").nav__radio-btn
            router-link(:to="{hash: 'cart'}", v-show="!loading").nav__link Cart
      transition(name="fadeinplace")
        ul(v-show="!loading")
          li
            router-link(:to="{name: 'Shop'}", :class="{'nav__radio-btn--selected': activeCategories.length === 0}").nav__radio-btn
            router-link(:to="{name: 'Shop'}").nav__link Everything
          li
            a(@click="filter('Home')", :class="{'nav__radio-btn--selected': activeCategories.indexOf(kebabCase('Home')) > -1}").nav__radio-btn
            a(@click="filter('Home')").nav__link Home
          li
            a(@click="filter('Body')", :class="{'nav__radio-btn--selected': activeCategories.indexOf(kebabCase('Body')) > -1}").nav__radio-btn
            a(@click="filter('Body')").nav__link Body
          li
            a(@click="filter('One Off')", :class="{'nav__radio-btn--selected': activeCategories.indexOf(kebabCase('One Off')) > -1}").nav__radio-btn
            a(@click="filter('One Off')").nav__link One Off
          li
            a(@click="filter('Partners')", :class="{'nav__radio-btn--selected': activeCategories.indexOf(kebabCase('Partners')) > -1}").nav__radio-btn
            a(@click="filter('Partners')").nav__link Partners
</template>

<script>
import DotGrid from '@/components/DotGrid'
import _kebabCase from 'lodash/kebabCase'
import _throttle from 'lodash/throttle'
export default {
  name: 'Header',
  props: ['loading'],
  components: {
    DotGrid
  },
  data () {
    return {
      condensed: false,
      kebabCase: _kebabCase
    }
  },
  computed: {
    activeCategories () {
      const cats = this.$route.query.categories
      if (cats) return cats.split(',')
      return []
    }
  },
  methods: {
    filter (category) {
      if (!category) return false
      const cat = _kebabCase(category)
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
      this.condensed = window.pageYOffset > 24
    }, 100)
  },
  mounted () {
    window.addEventListener('scroll', this.onScroll)
  },
  destroyed () {
    window.removeEventListener('scroll', this.onScroll)
  }
}
</script>

<style lang="scss" scoped>
@import '../style/variables';

header{
  background:$white;
  padding-bottom: 1px;
}

img{
  width:50%;
  transform:translateX(rem(-6px)) translateY(rem(-6px))
}

nav{
  padding:calc(25vh + #{$gutter}) $gutter 0;
  position: relative;
  margin-top: -25vh;
  transition:box-shadow $navCondenseDuration;
  .header--condensed &{
    box-shadow:0 0 8px black;
  }

  > ul{
    list-style-type: none;
    display: flex;
    text-align: left;
    > li{
      position: relative;
      flex:0 0 12.5%;
      height:0;
      padding-bottom:12.5%; // 6.25%;
      transition:padding-bottom $navCondenseDuration;
      
      .header--condensed &{
        padding-bottom:6.5%;
      }
      
      .app--loading &{
        $cycle: 5000ms;
        $steps: 4;
        $pace: ($cycle/2/$steps);
        &:nth-child(2) .nav__radio-btn{
          opacity:0;
          animation:pulse_p $cycle 0s infinite;
        }
        &:nth-child(3) .nav__radio-btn{
          opacity:0;
          animation:pulse_p $cycle $pace infinite;
        }
        &:nth-child(4) .nav__radio-btn{
          opacity:0;
          animation:pulse_p $cycle $pace*2 infinite;
        }    
        &:nth-child(5) .nav__radio-btn{
          opacity:0;
          animation:pulse_p $cycle $pace*3 infinite;
        }    
      }
    }
  }
}

.nav__link{
  position: absolute;
  top: 1.25em; left:0;
  width:100%;
  transition:opacity $fadeDuration;
  .app--loading &:not(span){
    opacity:0;
    visibility:hidden;
  }
}
.nav__radio-btn{
  display:block;
  width:rem(16px);
  height:rem(16px);
  background-image:url(../assets/icons/radio-btn.svg);
  background-size:contain;
  position: absolute;
  left: rem(-8px);
  top: rem(-8px);
  transition: opacity $fadeDuration;
  .app--loading &{
    transition:none;
  }
  // radio bullet
  .nav__primary-nav &.router-link-active, 
  &.nav__radio-btn--selected{
    background-image:url(../assets/icons/radio-btn--selected.svg);
  }
  .app--loading &.router-link-active:not(.nav__radio-btn--selected){
    background-image:url(../assets/icons/radio-btn.svg);
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