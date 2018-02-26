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
  position: absolute;
  top:rem(-8px);
  left:rem(-8px);
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
  .no-touchevents .app:not(.app--loading) &:hover,
  .no-touchevents .app:not(.app--loading) .radio-btn-label:hover + &{
    background-image:url(../assets/icons/radio-btn--selected.svg);
  }
}
</style>

<style lang="css">
  .radio-btn-label{
    cursor:pointer;
  }
</style>