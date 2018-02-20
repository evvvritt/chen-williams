<template lang="pug">
  header.app-header
    nav.nav
      ul.cw-grid
        li.cw-grid__item.mb-hidden
          nav-logo
        li.cw-grid__item
          a(@click="$emit('close')")
            nav-link Close
            radio-btn(fill="white")
      ul.cw-grid.tblt-hidden(v-if="title")
        li.cw-grid__item
          span
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
.cw-grid__item:after{
  visibility:hidden;
}
</style>