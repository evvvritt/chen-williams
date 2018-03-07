<template lang="pug">
  header.app-header.z1
    nav-logo(:condensed="true").tblt-hidden
    nav.nav
      ul.cw-grid
        li.cw-grid__item.mbl-hidden
          nav-logo(:condensed="true")
        li.cw-grid__item
          a(@click="$emit('close')")
            nav-link Close
            radio-btn(fill="white")
        li.cw-grid__item.tblt-hidden(v-if="title")
          a(@click="$emit('close')")
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
  .app-header{
    max-width:25%;
    overflow:hidden;
  }
  .cw-grid{
    width:100vw;
  }  
}
</style>