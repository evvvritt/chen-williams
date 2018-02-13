<template lang="pug">
  .radio-btn(:class="{'radio-btn--checked': checked}", :style="'background-color:' + fill")
</template>

<script>
export default {
  name: 'RadioBtn',
  props: {
    checked: { type: Boolean, default: false },
    fill: { type: String, default: 'transparent' }
  },
  data () {
    return {

    }
  }
}
</script>

<style lang="scss" scoped>
@import '../style/variables';

.radio-btn{
  cursor: pointer;
  width:rem(16px);
  height:rem(16px);
  background-image:url(../assets/icons/radio-btn.svg);
  background-size:contain;  
  background-repeat:no-repeat;
  overflow:hidden;
  border-radius:100px;

  .app:not(.app--loading) .router-link-exact-active &,
  .app:not(.app--loading) .nav__primary-nav .router-link-active &,
  &.radio-btn--checked,
  .app:not(.app--loading) &:hover,
  .app:not(.app--loading) .nav__link:hover + &{
    background-image:url(../assets/icons/radio-btn--selected.svg);
  }
}
</style>