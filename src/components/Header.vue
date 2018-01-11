<template lang="pug">
  header
    dot-grid(:rows="2", :overlay="false")
    nav
      ul
        li
          router-link(to="/")
            img(src)
        li
          router-link(:to="{name: 'Shop'}").nav__radio-btn 
          router-link(:to="{name: 'Shop'}", v-if="!loading").nav__primary-link Shop
          span(v-else) Loading
        li
          router-link(:to="{name: 'Furniture'}").nav__radio-btn
          router-link(:to="{name: 'Furniture'}").nav__primary-link Furniture
        li
          router-link(:to="{name: 'Projects'}").nav__radio-btn
          router-link(:to="{name: 'Projects'}").nav__primary-link Projects
        li
          router-link(:to="{name: 'Page', params: {slug: 'info'}}").nav__radio-btn
          router-link(:to="{name: 'Page', params: {slug: 'info'}}").nav__primary-link Info
        transition(name="fadeinplace")
          li(v-show="!loading")
            a(href="http://archive.chen-williams.com", target="_blank", rel="noopener").nav__radio-btn
            a(href="http://archive.chen-williams.com", target="_blank", rel="noopener") Archive
        transition(name="fadeinplace")
          li(v-show="!loading")
            router-link(:to="{hash: 'cart'}").nav__radio-btn
            router-link(:to="{hash: 'cart'}", v-show="!loading") Cart
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
      padding-top:1em;
      
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

.nav__primary-link{
  transition:opacity 500ms;
  .app--loading &{
    opacity:0;
    visibility:hidden;
  }
}
.nav__radio-btn{
  display:block;
  width:rem(16px);
  height:rem(16px);
  // background:$white;
  position: absolute;
  left: rem(-8px);
  top: rem(-8px);
  border-style:solid;
  border-radius:100rem;
  transition: opacity 500ms;
  .app--loading &{
    transition:none;
  }
  // radio bullet
  &.router-link-active{
    &:before{
      content:'';
      display:block;
      position: absolute;
      width:rem(6px);
      height:rem(6px);
      background:$black;
      border-radius:10rem;
      top:rem(4px);
      left:rem(4px);
    }
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