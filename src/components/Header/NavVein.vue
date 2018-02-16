<template lang="pug">
  .nav__vein.absolute(:data-edge="edge")
</template>

<script>
export default {
  name: 'NavVein',
  props: {
    edge: {
      type: String,
      default: 'left'
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../style/variables';
$gap: 16px;

.nav__vein{
  opacity:0;
  position: absolute;
  z-index:-1;
  border-width:1px;
  .nav__primary-nav .router-link-active &{
    opacity:1;
    left:-1px;
    top:3em;
    border-left-style:solid;
    height:calc(100% - 3em - #{$gap});
    @include mobile {
      top:-1px;
      left:$gap;
      width:calc(100% - 32px);
      border-left-style:none;
      border-top-style: solid;
      height:0;
    }
  }
  // in subnav
  .nav__subnav &{
    opacity:1;
    top: -1px;
    left:$gap;
    width:calc(100% - 32px);
    border-top-style: solid;
    @include mobile{
      top: 3em;
      border-left-style:solid;
      height:calc(100% - 3em - #{$gap});
      left:-1px;
      width:0;
      border-top-style:none;
    }
  }
  // loading
  .app--loading &{
    opacity:0 !important;
  }
}

@include mobile {
  .nav--collapsed{
    .nav__vein{
      display:none;
    }
    .nav__primary-nav .router-link-active .nav__vein{
      display: block;
    }
  }
}
</style>