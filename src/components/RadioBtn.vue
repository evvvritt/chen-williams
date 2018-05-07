<template lang="pug">
  .radio-btn.flex.items-center.justify-center(:class="classes", :style="'background-color:' + fill", @click="$emit('click')")
    span.block
      slot
</template>

<script>
export default {
  name: 'RadioBtn',
  props: {
    checked: { type: Boolean, default: false },
    dotted: { type: Boolean, default: false },
    fill: { type: String, default: 'transparent' },
    right: { type: Boolean, default: false },
    type: { type: String, default: '' }
  },
  computed: {
    classes () {
      return {
        'radio-btn--checked': this.checked,
        'radio-btn--dotted': this.dotted,
        'radio-btn--right': this.right,
        'radio-btn--close': this.type === 'close'
      }
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
  width:$radioBtnSize;
  height:$radioBtnSize;
  background-image:url(../assets/icons/radio-btn.svg);
  background-size:contain;  
  background-repeat:no-repeat;
  overflow:hidden;
  border-radius:100px;

  &.radio-btn--right{
    left:auto;
    right:rem(-8px);
  }

  &.radio-btn--close{
    background-image:url(../assets/icons/radio-btn--close.svg) !important;
  }

  &.radio-btn--dotted{
    background-image:url(../assets/icons/radio-btn--dotted.svg) !important;
  }

  .app:not(.app--loading) .router-link-exact-active &,
  .app:not(.app--loading) .nav__primary-nav .router-link-active &,
  &.radio-btn--checked,
  // .no-touchevents .app:not(.app--loading) &:hover,
  // .no-touchevents .app:not(.app--loading) .radio-btn-label:hover + &
  {
    background-image:url(../assets/icons/radio-btn--selected.svg) !important;
  }
  
  /*
  .no-touchevents .app:not(.app--loading) &.radio-btn--checked:hover,
  .no-touchevents .app:not(.app--loading) .mb-active-filter .radio-btn-label:hover + &{
    background-image:url(../assets/icons/radio-btn--dotted.svg) !important;
    background-image:url(../assets/icons/radio-btn--close.svg) !important;
  }
  */


  span{
    font-size:70%;
  }
}
</style>

<style lang="css">
  .radio-btn-label{
    cursor:pointer;
  }
</style>