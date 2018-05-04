<template lang="pug">
  header.z1.pointer-events-none
    nav.nav
      ul.cw-grid
        li.cw-grid__item.mbl-hidden
          .cw-grid__item__sizer
            nav-logo.pointer-events(:condensed="true")
        li.cw-grid__item
          .cw-grid__item__sizer
            a.pointer-events(@click="$emit('close')")
              nav-link Close
              radio-btn(fill="white", type="close")
        li.cw-grid__item.tblt-hidden(v-if="title")
          .cw-grid__item__sizer
            a
              nav-link {{title}}
              radio-btn(fill="white", :checked="true")
</template>

<script>
import RadioBtn from '@/components/RadioBtn'
import NavLogo from '@/components/Header/NavLogo'
import NavLink from '@/components/Header/NavLink'
export default {
  name: 'OverlayHeader',
  props: ['title'],
  components: { RadioBtn, NavLogo, NavLink }
}
</script>

<style lang="scss" scoped>
@import '../style/variables';

.cw-grid__item:after{
  visibility:hidden;
}
@include grid9{
  header{
    max-width:25%;
    overflow:hidden;
  }
  .nav > .cw-grid{
    width:calc(100vw - #{$gutter} * 2);
  }  
}
</style>