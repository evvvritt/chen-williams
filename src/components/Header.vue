<template lang="pug">
  header.app-header(:class="{'app-header--condensed': condensed}")
    dot-grid(:rows="2", :overlay="false", :condensed="condensed")
    nav.nav
      //- loading
      template(v-if="loading")
        ul.nav__primary-nav.cw-grid
          router-link(tag="li", to="/").cw-grid__item
            a
              img(src='../assets/logo.svg')
          li
            span.nav__link Loading
            radio-btn(:checked="true")
          li <radio-btn/>
          li <radio-btn/>
          li <radio-btn/>
      //- loaded
      template(v-else)
        ul.nav__primary-nav.cw-grid(:class="{'cw-grid--condensed': condensed}")
          //- logo
          router-link(tag="li", to="/").cw-grid__item
            a
              img(src='../assets/logo.svg')
          //- categories loop
          router-link(v-for="(item, index) in nav", :key="index", tag="li", :to="{name: 'Category', params: {catSlug: item.primary.category_link.uid}}").cw-grid__item
            a
              span.nav__link {{item.primary.category_link.data.title | text}}
              radio-btn
            .nav__vein
          //- info
          router-link(tag="li", :to="{hash: 'info'}").cw-grid__item
            a
              span.nav__link Info
              radio-btn
          //- archive
          transition(name="fadeinplace")
            li.cw-grid__item(v-show="!loading")
              a(target="_blank", rel="noopener")
                span.nav__link Archive
                radio-btn
          //- cart
          transition(name="fadeinplace")
            router-link(tag="li", :to="{hash: 'cart'}").cw-grid__item(v-show="!loading")
              a(v-show="!loading")
                span.nav__link Cart
                radio-btn
        //- sub navs
        ul.nav__subnav.cw-grid(v-for="(item, index) in nav", :key="index", v-show="isCategory(item.primary.category_link.uid)", :class="{'cw-grid--condensed': condensed}")
          router-link(tag="li", :to="{name: 'Category', params: {catSlug: item.primary.category_link.uid}}").cw-grid__item
            a
              span.nav__link Everything
              radio-btn
            .nav__vein
          //- loop 
          li.cw-grid__item(v-for="(subitem, index) in item.items")
            //- tags
            template(v-if="subitem.link.type === 'tag'")
              a(@click="filter(subitem.link.uid)")
                span.nav__link {{subitem.link.data.label | text}}
                radio-btn(:checked="activeFilter(subitem.link.uid)")
            //- partners
            template(v-if="subitem.link.type === 'partners'")
              router-link(:to="{name: 'Partners'}")
                span.nav__link {{subitem.link.data.title | text}}
                radio-btn
            .nav__vein(v-if="index < item.items.length - 1")
</template>

<script>
import DotGrid from '@/components/DotGrid'
import RadioBtn from '@/components/RadioBtn'
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
    nav () {
      return this.$store.state.site.nav
    },
    activeCategories () {
      const cats = this.$route.query.categories
      if (cats) return cats.split(',')
      return []
    }
  },
  watch: {
    '$route' (to, from) {
      this.bindScroll(false) // unbind
      const isOverlay = to.hash === '#info' || to.hash === '#cart' || this.$route.meta.isOverlay
      this.$nextTick(() => this.bindScroll(!isOverlay)) // bind if not overlay
    }
  },
  methods: {
    isCategory (catUID) {
      return this.$route.params.catSlug === catUID
    },
    activeFilter (filter) {
      if (!filter) return false
      return this.activeCategories.indexOf(filter) > -1
    },
    filter (category) {
      if (!category) return false
      const cat = category
      let cats = this.$route.query.filter // empty object || string
      // if none already: add 1
      if (!cats || cats.length === 0) return this.$router.replace({query: {filter: cat}})
      // otherwise add/remove
      cats = cats.split(',')
      const index = cats.indexOf(cat)
      if (index > -1) {
        // remove
        cats.splice(index, 1)
        if (cats.length === 0) return this.$router.replace({query: null})
      } else {
        // add
        cats.push(cat)
      }
      cats = cats.join(',')
      this.$router.replace({query: {filter: cats}})
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
  padding-bottom: 1px;
}

.nav{
  padding:calc(25vh + #{$gutter}) $gutter 0;
  position: relative;
  margin-top: -25vh;
  transition:box-shadow $navCondenseDuration;
  .app-header--condensed &{
    box-shadow: 0 0 50px -20px #000000;
  }

  ul{
    list-style-type: none;
    text-align: left;
  }

  > ul{
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
  // .app--loading &:not(.nav__link--load-lbl){
    // opacity:0;
    // visibility:hidden;
  // }
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