<template lang="pug">
  .header-body.left-align(:class="{'header-body--condensed': condensed, 'mbl-bg-white': !mobileCollapsed || loading}")
    //- mobile cart button
    router-link(:to="{hash: 'cart'}", v-show="cartCount > 0").tblt-hidden.absolute.right-0.top-0.p2.z3
      .relative
        radio-btn(fill="white", :right="true") {{cartCount}}
    //- nav
    nav#nav.nav.relative.overflow-hidden(:class="{'nav--mbl-collapsed': mobileCollapsed && !loading}")
      dot-grid.tblt-hidden.z1(:rows="9", :overlay="false")
      //- mobile - show menu overlay
      .absolute.overlay.tblt-hidden.z2.tap-color-none(v-show="mobileCollapsed", @click="mobileCollapsed = false")
      //- mobile - menu btn
      ul.cw-grid.tblt-hidden.tap-color-none(v-show="!loading", @click="mobileCollapsed = !mobileCollapsed")
        .cw-grid__item(v-show="mobileCollapsed")
          .cw-grid__item__sizer
            nav-link Menu
            radio-btn(:checked="false", fill="white")
        .cw-grid__item(v-show="!mobileCollapsed")
          .cw-grid__item__sizer
            nav-link Close
            radio-btn(type="close")
      //- loading
      template(v-if="loading")
        div
          ul.nav__primary-nav.cw-grid
            li.cw-grid__item.mbl-hidden
              .cw-grid__item__sizer
                router-link(to="/")
                  logo(:condensed="condensed")
            li.cw-grid__item
              .cw-grid__item__sizer
                nav-link Loading
                radio-btn(:checked="true")
            li.cw-grid__item.mbl-hidden
              .cw-grid__item__sizer
                <radio-btn/>
            li.cw-grid__item.mbl-hidden
              .cw-grid__item__sizer
                <radio-btn/>
            li.cw-grid__item.mbl-hidden
              .cw-grid__item__sizer
                <radio-btn/>
      //- loaded
      template(v-else)
        div
          ul.nav__primary-nav.cw-grid.relative.z1(:class="{'cw-grid--condensed': condensed}")
            dot-grid.mbl-hidden(:rows="1", :overlay="false", :padless="true")
            //- logo
            li#app-header__desktop-logo.cw-grid__item.mbl-hidden
              .cw-grid__item__sizer
                logo(:condensed="condensed")
            //- categories loop
            router-link(v-for="(item, index) in nav", :key="index", tag="li", :to="{name: 'Category', params: {catSlug: item.primary.category_link.uid}}").cw-grid__item
              .cw-grid__item__sizer
                a
                  nav-link {{item.primary.category_link.data.title | text}}
                  radio-btn
                nav-vein
            //- info
            router-link(tag="li", :to="{hash: 'info'}").cw-grid__item
              .cw-grid__item__sizer
                a
                  nav-link Info
                  radio-btn
            //- archive
            transition(name="fade")
              li.cw-grid__item(v-if="showArchiveLink", v-show="!loading")
                .cw-grid__item__sizer
                  a(href="http://archive.cckw.us")
                    nav-link Archive
                    radio-btn
            //- cart
            transition(name="fade")
              router-link(tag="li", :to="{hash: 'cart'}", v-show="!loading").cw-grid__item
                .cw-grid__item__sizer
                  a(v-show="!loading")
                    nav-link Cart
                    radio-btn
        //- sub navs
        .nav__subnavs.relative.z1
          dot-grid.mbl-hidden(:rows="1", :overlay="false", :padless="true")
          ul.nav__subnav.cw-grid(v-for="(subnav, navIndex) in nav", :key="navIndex", v-show="isCategory(subnav.primary.category_link.uid)", :class="{'cw-grid--condensed': condensed}")
            router-link(tag="li", :to="{name: 'Category', params: {catSlug: subnav.primary.category_link.uid}}").cw-grid__item
              .cw-grid__item__sizer
                span(@click="mobileCollapsed = true")
                  a
                    nav-link Everything
                    radio-btn
                nav-vein
            //- loop through filters
            li.cw-grid__item(v-for="(subitem, index) in subnav.items", :class="{'mb-active-filter': isActiveFilter(subitem.link.uid)}")
              .cw-grid__item__sizer
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
</template>

<script>
import Vue from 'vue'
import { mapState } from 'vuex'
import DotGrid from '@/components/DotGrid'
import RadioBtn from '@/components/RadioBtn'
import Logo from './NavLogo'
import NavLink from './NavLink'
import NavVein from './NavVein'
// import _throttle from 'lodash/throttle'
export default {
  name: 'HeaderBody',
  components: { DotGrid, RadioBtn, Logo, NavLink, NavVein },
  props: ['condensed'],
  data () {
    return {
      // condensed: false,
      mobileCollapsed: true
    }
  },
  computed: {
    ...mapState(['loading', 'site']),
    nav () {
      return this.site ? this.site.nav : []
    },
    cartCount () {
      return this.$store.getters.cartCount
    },
    activeFilters () {
      const filters = this.$route.query.filter
      if (filters) return filters.split(',')
      return []
    },
    showArchiveLink () {
      return this.site && this.site.show_archive_link === 'true'
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
      // Mobile – open menu first, if collapsed, otherwise close
      if (Vue.is('mobile') && this.mobileCollapsed) {
        this.mobileCollapsed = false
        return
      }
      this.mobileCollapsed = true
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
    }
  }
}
</script>

<style lang="scss">
@import '../../style/variables';

.nav{
  padding:$gutter $gutter 0; // calc(25vh + #{$gutter}) $gutter 0;

  ul{
    list-style-type: none;
  }
  
  // loading animation
  .cw-grid__item{
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

.nav .radio-btn{
  z-index:2;
  transition: opacity $fadeDuration;
  .app--loading &{
    transition:none;
  }
}

@include mobile {
  
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
        width:100%;
        transition:none;
      }
    }
    // closed state
    &.nav--mbl-collapsed{
      min-height:0;
      height: calc((100vw - 4rem)/5 + 2rem - 1px);
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

@media (min-width:$bkpt-navCondense-25) {
  // translate doesn't move the tap area :/
  .header-body--condensed{
    pointer-events:none;
    a{
      pointer-events:auto;
    }
  }
  // pull up subnav
  .nav__subnavs{
    transition:transform $navCondenseDuration;
    will-change:transform;
    .header-body--condensed &{
      transform: translateY(-25%);
    }
  }
  // shrink vein
  #nav .nav__primary-nav .router-link-active .nav__vein{
    transition:max-height $navCondenseDuration;
    will-change:max-height;
    .header-body--condensed & {
      max-height:calc(75% - 2.75em - 16px);
    }
  }
}

@media (min-width:$bkpt-navCondense-50) {
  // pull up subnav
  .nav__subnavs{
    transition:transform $navCondenseDuration;
    .header-body--condensed &{
      transform: translateY(-50%);
    }
  }
  // shrink vein
  #nav .nav__primary-nav .router-link-active .nav__vein{
    transition:max-height $navCondenseDuration;
    .header-body--condensed & {
      max-height:calc(50% - 2.75em - 16px);
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