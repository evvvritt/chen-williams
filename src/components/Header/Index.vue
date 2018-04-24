<template lang="pug">
  header.app-header.left-align(:class="{'app-header--condensed': condensed, 'mbl-bg-white app-header--mobile-collapsed': !mobileCollapsed}")
    //- mobile cart button
    router-link(:to="{hash: 'cart'}", v-show="cartCount > 0").tblt-hidden.absolute.right-0.top-0.p2.z3
      .relative
        radio-btn(fill="white", :right="true") {{cartCount}}
    //- nav
    nav#nav.nav.relative.overflow-hidden(:class="{'nav--mbl-collapsed': mobileCollapsed}")
      dot-grid.tblt-hidden.z1(:rows="9", :overlay="false")
      //- mobile - show menu overlay
      .absolute.overlay.tblt-hidden.z2.tap-color-none(v-show="mobileCollapsed", @click="mobileCollapsed = false")
      //- mobile - menu btn
      ul.cw-grid.tblt-hidden.tap-color-none(v-show="!loading", @click="mobileCollapsed = !mobileCollapsed")
        .cw-grid__item(v-show="mobileCollapsed")
          nav-link Menu
          radio-btn(:checked="true", fill="white")
        .cw-grid__item(v-show="!mobileCollapsed")
          nav-link Close
          radio-btn(type="close")
      //- loading
      template(v-if="loading")
        ul.nav__primary-nav.cw-grid
          li.cw-grid__item.mbl-hidden
            router-link(to="/")
              logo(:condensed="condensed")
          li.cw-grid__item.mbl-hidden
            nav-link Loading
            radio-btn(:checked="true")
          li.cw-grid__item.mbl-hidden <radio-btn/>
          li.cw-grid__item.mbl-hidden <radio-btn/>
          li.cw-grid__item.mbl-hidden <radio-btn/>
      //- loaded
      template(v-else)
        ul.nav__primary-nav.cw-grid.relative.z1(:class="{'cw-grid--condensed': condensed}")
          dot-grid.mbl-hidden(:rows="1", :overlay="false", :padless="true")
          //- logo
          li.cw-grid__item.mbl-hidden
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
          //- transition(name="fade")
            li.cw-grid__item(v-show="!loading")
              a(target="_blank", rel="noopener")
                nav-link Archive
                radio-btn
          //- cart
          transition(name="fade")
            router-link(tag="li", :to="{hash: 'cart'}", v-show="!loading").cw-grid__item
              a(v-show="!loading")
                nav-link Cart
                radio-btn
        //- sub navs
        .nav__subnavs.relative.z1
          dot-grid.mbl-hidden(:rows="1", :overlay="false", :padless="true")
          ul.nav__subnav.cw-grid(v-for="(subnav, navIndex) in nav", :key="navIndex", v-show="isCategory(subnav.primary.category_link.uid)", :class="{'cw-grid--condensed': condensed}")
            router-link(tag="li", :to="{name: 'Category', params: {catSlug: subnav.primary.category_link.uid}}").cw-grid__item
              a
                nav-link Everything
                radio-btn
              nav-vein
            //- loop through filters
            li.cw-grid__item(v-for="(subitem, index) in subnav.items", :class="{'mb-active-filter': isActiveFilter(subitem.link.uid)}")
              //- filters (tags)
              template(v-if="subitem.link.type === 'tag'")
                a(@click="filter(subitem.link.uid)")
                  nav-link {{subitem.link.data.label | text}}
                  radio-btn(:checked="isActiveFilter(subitem.link.uid)")
                nav-vein.mbl-hidden(v-if="navIndex + 1 > subnav.items.length")
              //- partners
              template(v-if="subitem.link.type === 'partners'")
                router-link(:to="{name: 'Partners'}", v-if="$route.params.catSlug")
                  nav-link {{subitem.link.data.title | text}}
                  radio-btn
              nav-vein(v-if="index < subnav.items.length - 1")
        //- background
        #nav__bg.absolute.overlay.top-0.backdrop-blur
          #nav__bg__fill.absolute.overlay
          .absolute.left-0.bottom-0.w-100.px2.mbl-hidden
            .relative
              dot-grid(:rows="1", :overlay="false", :padless="true", :keepFirstDot="true")
</template>

<script>
import Vue from 'vue'
import DotGrid from '@/components/DotGrid'
import RadioBtn from '@/components/RadioBtn'
import Logo from './NavLogo'
import NavLink from './NavLink'
import NavVein from './NavVein'
import _throttle from 'lodash/throttle'
export default {
  name: 'Header',
  components: { DotGrid, RadioBtn, Logo, NavLink, NavVein },
  data () {
    return {
      condensed: false,
      mobileCollapsed: true
    }
  },
  computed: {
    loading () {
      return this.$store.state.loading
    },
    nav () {
      return this.$store.state.site.nav
    },
    cartCount () {
      return this.$store.getters.cartCount
    },
    activeFilters () {
      const filters = this.$route.query.filter
      if (filters) return filters.split(',')
      return []
    }
  },
  watch: {
    '$route' (to, from) {
      this.mobileCollapsed = true
      // unbind
      this.bindScroll(false)
      // re-bind if not overlay
      const isOverlay = to.hash === '#info' || to.hash === '#cart' || this.$route.meta.isOverlay
      this.$nextTick(() => this.bindScroll(!isOverlay))
    }
  },
  methods: {
    isCategory (catUID) {
      return this.$route.params.catSlug === catUID
    },
    isActiveFilter (filter) {
      if (!filter) return false
      return this.activeFilters.indexOf(filter) > -1
    },
    filter (filter) {
      if (!filter) return false
      // Mobile – open menu first, if collapsed
      if (Vue.is('mobile') && this.mobileCollapsed) {
        this.mobileCollapsed = false
        return
      }
      // setup route
      const catSlug = this.$route.params.catSlug
      if (!catSlug) return false
      const route = {name: 'Category', params: {catSlug: catSlug}}
      // active filters
      let filters = this.$route.query.filter
      filters = filters ? filters.split(',') : []
      // add/remove
      const index = filters.indexOf(filter)
      const isActive = index > -1
      if (isActive) filters.splice(index, 1) // remove if exists
      else filters.push(filter) // add
      // update route obj
      route.query = filters.length > 0 ? {filter: filters.join(',')} : null
      return this.$router.replace(route)
    },
    onScroll: _throttle(function () {
      this.condensed = window.pageYOffset > 2
    }, 50),
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

#app-header{
  padding-bottom: 1px;
}

.nav{
  padding:$gutter $gutter 0; // calc(25vh + #{$gutter}) $gutter 0;
  transition:box-shadow $navCondenseDuration;

  ul{
    list-style-type: none;
  }

  > ul{
    > li{
      position: relative;
      height:0;
      transition:padding-bottom $navCondenseDuration;
      
      // loading animation
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
}

#nav__bg{
  z-index:-2;
  transition:all $navCondenseDuration;
  opacity:0;
  .app-header--condensed & {
    // transform:translateY(calc(-1 * (100% - #{$gutter}) / 2));
    opacity:1;
  }
}
#nav__bg__fill{
  width:110%;
  left:-5%;
  box-shadow: 0 0 50px -20px #000000;
  background:rgba($white, .8);
}

@include mobile {
  #app-header{
    max-height:100vh;
    overflow-y:auto;
  }
  // .app-header__dot-grid{
    // align-items:flex-start;
    // align-content:flex-start;
  // }
  
  #nav{
    display:flex;
    align-items:flex-start;
    justify-content: flex-start;
    min-height:100vh;
    padding-bottom:$gutter;
    // 4 cols
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
    // closed state
    &.nav--mbl-collapsed{
      min-height:0;
      height:calc((100vw - 4rem)/4 + 2rem - 1px);
      .nav__subnavs .nav__vein{
        display:none;
      }
    }
    // active items jump to top of column
    .nav__subnav .router-link-exact-active, // so partners jumps to top
    .nav__primary-nav .router-link-active{
      order:-1;
    }
  }

  .nav--mbl-collapsed{
    li.cw-grid__item{
      display:none;
      &.router-link-active{
        display: block;
      }
    }
  }
}

// > 769px: condense = 25%
@media (min-width:$mobile + 1) {
  @supports (pointer-events:none) {
    #app-header.app-header--condensed{
      &, #nav{
        pointer-events:none;
      }
      a, #nav__bg{
        pointer-events:auto;
      }
    }
    .nav__subnavs{
      transition:transform $navCondenseDuration;
      .app-header--condensed &{
        transform: translateY(-25%);
      }
    }
    #nav__bg{
      .app-header--condensed &{
        transform:translateY(calc(-1 * (100% - #{$gutter}) / 4));
      }
    }
    #nav .nav__primary-nav .nav__vein{
      transition:max-height $navCondenseDuration;
      .app-header--condensed & {
        max-height:calc(75% - 2.75em - 16px);
      }
    }
  }
}

// > 1280px: condense = 50%
@media (min-width:1280px) {
  @supports (pointer-events:none) {
    .nav__subnavs{
      transition:transform $navCondenseDuration;
      .app-header--condensed &{
        transform: translateY(-50%);
      }
    }
    #nav__bg{
      .app-header--condensed &{
        transform:translateY(calc(-1 * (100% - #{$gutter}) / 2));
      }
    }
    #nav .nav__primary-nav .nav__vein{
      transition:max-height $navCondenseDuration;
      .app-header--condensed & {
        max-height:calc(50% - 2.75em - 16px);
      }
    }
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
</style>