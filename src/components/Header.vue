<template lang="pug">
  header
    dot-grid(:rows="2", :overlay="false")
    nav
      ul
        li
          router-link(to="/")
            img(src='../assets/logo.svg')
        li
          router-link(:to="{name: 'Shop'}", :class="{'nav__radio-btn--selected': loading}").nav__radio-btn
          router-link(:to="{name: 'Shop'}", v-if="!loading").nav__link Shop
          span(v-else) Loading
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
</template>

<script>
import DotGrid from '@/components/DotGrid'
export default {
  name: 'Header',
  props: ['loading'],
  components: {
    DotGrid
  },
  data () {
    return {

    }
  }
}
</script>

<style lang="scss" scoped>
@import '../style/variables';

img{
  width:50%;
  transform:translateX(rem(-6px)) translateY(rem(-6px))
}

nav{
  padding:$gutter;
  position: relative;

  > ul{
    list-style-type: none;
    display: flex;
    text-align: left;
    > li{
      flex:0 0 12.5%;
      position: relative;
      
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
  display: inline-block;
  margin-top: 1.25em;
  transition:opacity $fadeDuration;
  .app--loading &{
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
  &.router-link-active, 
  &.nav__radio-btn--selected{
    background-image:url(../assets/icons/radio-btn--selected.svg);
  }
  .app--loading &.router-link-active{
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