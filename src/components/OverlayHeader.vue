<template lang="pug">
  header.app-header
    nav.nav
      ul.cw-grid
        li.cw-grid__item
          nav-logo
        li.cw-grid__item
          a(@click="$emit('close')")
            nav-link Close
            radio-btn(fill="white")
</template>

<script>
import RadioBtn from '@/components/RadioBtn'
import NavLogo from '@/components/Header/NavLogo'
import NavLink from '@/components/Header/NavLink'
export default {
  name: 'OverlayHeader',
  components: { RadioBtn, NavLogo, NavLink }
}
</script>

<style lang="scss" scoped>
.cw-grid__item:after{
  visibility:hidden;
}
</style>