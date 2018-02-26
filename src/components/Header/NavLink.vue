<template lang="pug">
  span.nav__link.radio-btn-label.absolute.pointer.top-0
    slot
</template>

<script>
export default {
  name: 'NavLink'
}
</script>

<style lang="scss" scoped>
@import '../../style/variables';
.nav__link{
  left:-0.5em;
  padding: 1.15em 0.5em 0;
  transition:opacity $fadeDuration;
  z-index:1;
  // .app--loading &:not(.nav__link--load-lbl){
    // opacity:0;
    // visibility:hidden;
  // }
}
</style>