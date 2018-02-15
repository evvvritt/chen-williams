<template lang="pug">
  header.app-header
    nav.nav
      ul.cw-grid
        li.cw-grid__item
          router-link(to="/")
            img(src='../assets/logo.svg')
        li.cw-grid__item
          a(@click="$emit('close')")
            .nav__link Close
            radio-btn(fill="white")
</template>

<script>
import RadioBtn from '@/components/RadioBtn'
export default {
  name: 'OverlayHeader',
  components: { RadioBtn }
}
</script>

<style lang="scss" scoped>
.cw-grid__item:after{
  visibility:hidden;
}
</style>