<template lang="pug">
  header.app-header(:class="{'app-header--condensed': condensed, 'bg-white': !mobileCollapsed}")
    dot-grid.app-header__dot-grid(:rows="dotGridRows", :overlay="false", :condensed="condensed")
    logo.tblt-hidden
    nav.nav.relative(:class="{'nav--collapsed': mobileCollapsed}")
      //- mobile
      ul.cw-grid.tblt-hidden(v-show="!loading", @click="mobileCollapsed = !mobileCollapsed")
        .cw-grid__item
          nav-link(v-html="mobileCollapsed ? 'Menu' : 'Close'")
          radio-btn(:checked="false")
      //- loading
      template(v-if="loading")
        ul.nav__primary-nav.cw-grid
          li.cw-grid__item.mb-hidden
            router-link(to="/")
              logo(:condensed="condensed")
          li
            nav-link Loading
            radio-btn(:checked="true")
          li <radio-btn/>
          li <radio-btn/>
          li <radio-btn/>
      //- loaded
      template(v-else)
        ul.nav__primary-nav.cw-grid(:class="{'cw-grid--condensed': condensed}")
          //- logo
          li.cw-grid__item.mb-hidden
            logo(:condensed="condensed")
          //- categories loop
          router-link(v-for="(item, index) in nav", :key="index", tag="li", :to="{name: 'Category', params: {catSlug: item.primary.category_link.uid}}").cw-grid__item
            a
              nav-link {{item.primary.category_link.data.title | text}}
              radio-btn
            nav-vein
          //- info
          router-link(tag="li", :to="{hash: 'info'}").cw-grid__item
            a
              nav-link Info
              radio-btn
          //- archive
          transition(name="fade")
            li.cw-grid__item(v-show="!loading")
              a(target="_blank", rel="noopener")
                nav-link Archive
                radio-btn
          //- cart
          transition(name="fade")
            router-link(tag="li", :to="{hash: 'cart'}").cw-grid__item(v-show="!loading")
              a(v-show="!loading")
                nav-link Cart
                radio-btn
        //- sub navs
        ul.nav__subnav.cw-grid(v-for="(subnav, index) in nav", :key="index", v-show="isCategory(subnav.primary.category_link.uid)", :class="{'cw-grid--condensed': condensed}")
          router-link(tag="li", :to="{name: 'Category', params: {catSlug: subnav.primary.category_link.uid}}").cw-grid__item
            a
              nav-link Everything
              radio-btn
            nav-vein
          //- loop 
          li.cw-grid__item(v-for="(subitem, index) in subnav.items", :class="{'mb-active-filter': activeFilter(subitem.link.uid)}")
            //- tags
            template(v-if="subitem.link.type === 'tag'")
              a(@click="filter(subitem.link.uid)")
                nav-link {{subitem.link.data.label | text}}
                radio-btn(:checked="activeFilter(subitem.link.uid)")
            //- partners
            template(v-if="subitem.link.type === 'partners'")
              router-link(:to="{name: 'Partners'}")
                nav-link {{subitem.link.data.title | text}}
                radio-btn
            nav-vein(v-if="index < subnav.items.length - 1")
</template>

<script>
import DotGrid from '@/components/DotGrid'
import RadioBtn from '@/components/RadioBtn'
import Logo from './NavLogo'
import NavLink from './NavLink'
import NavVein from './NavVein'
import _throttle from 'lodash/throttle'
export default {
  name: 'Header',
  props: ['loading'],
  components: { DotGrid, RadioBtn, Logo, NavLink, NavVein },
  data () {
    return {
      condensed: false,
      mobileCollapsed: true,
      dotGridRows: window.innerWidth < 768 ? 8 : 2
    }
  },
  computed: {
    nav () {
      return this.$store.state.site.nav
    },
    activeFilters () {
      const filters = this.$route.query.filter
      if (filters) return filters.split(',')
      return []
    }
  },
  watch: {
    '$route' (to, from) {
      this.bindScroll(false) // unbind
      const isOverlay = to.hash === '#info' || to.hash === '#cart' || this.$route.meta.isOverlay
      this.$nextTick(() => this.bindScroll(!isOverlay)) // bind if not overlay
      // collapse on mobile ?
      if (to.path !== from.path) this.mobileCollapsed = true
    }
  },
  methods: {
    isCategory (catUID) {
      return this.$route.params.catSlug === catUID
    },
    activeFilter (filter) {
      if (!filter) return false
      return this.activeFilters.indexOf(filter) > -1
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
@import '../../style/variables';

#app-header.app-header--condensed{
  background:rgba($white, .8);
}

.app-header{
  padding-bottom: 1px;
}

.nav{
  padding:calc(25vh + #{$gutter}) $gutter 0;
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
      
      .app--loading &{
        $cycle: 5000ms;
        $steps: 4;
        $pace: ($cycle/2/$steps);
        &:nth-child(2) .radio-btn{
          opacity:0;
          animation:pulse $cycle 0s infinite;
        }
        &:nth-child(3) .radio-btn{
          opacity:0;
          animation:pulse $cycle $pace infinite;
        }
        &:nth-child(4) .radio-btn{
          opacity:0;
          animation:pulse $cycle $pace*2 infinite;
        }    
        &:nth-child(5) .radio-btn{
          opacity:0;
          animation:pulse $cycle $pace*3 infinite;
        }    
      }
    }
  }
}

.nav .radio-btn{
  z-index:2;
  transition: opacity $fadeDuration;
  .app--loading &{
    transition:none;
  }
  // radio bullet
  .nav__primary-nav &.router-link-active,
  .nav__subnav &.router-link-exact-active,
  &.nav__radio-btn--selected{
    background-image:url(../../assets/icons/radio-btn--selected.svg);
  }
  .app--loading &.router-link-active:not(.nav__radio-btn--selected){
    background-image:url(../../assets/icons/radio-btn.svg);
  }
}

@keyframes pulse{
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

@include mobile {
  #app-header{
    max-height:100vh;
    overflow-y:auto;
    &.bg-white{ background:$white; }
  }
  .app-header__dot-grid{
    align-items:flex-start;
    align-content:flex-start;
  }
  
  .nav{
    display:flex;
    align-items:flex-start;
    justify-content: flex-start;
    min-height:125vh;
    // overflow-y:auto;
    &.nav--collapsed{
      min-height:0;
      height:calc(25vh + (100vw - 4rem)/4 + 2rem);
      overflow:hidden;
    }
    > *{
      flex:0 0 25%;
    }
    ul.cw-grid{
      flex-direction:column;
      align-items: stretch;
      .cw-grid__item{
        padding-bottom: 100%;
        transition:none;
      }
    }
    // active at top of column
    // .nav__subnav .mb-active-filter,
    .nav__subnav .router-link-exact-active, // so partners jumps to top
    .nav__primary-nav .router-link-active{
      order:-1;
    }
  }

  .nav--collapsed{
    li.cw-grid__item{
      display:none;
      &.router-link-active{
        display: block;
      }
    }
  }
}
</style>