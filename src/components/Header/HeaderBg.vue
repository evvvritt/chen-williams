<template lang="pug">
  .header-bg.overflow-hidden.backdrop-blur-ff
    //- height sizer: two grid rows
    .relative
      .cw-grid.cw-grid--no-dots(v-for="n in 2")
        .cw-grid__item
          .cw-grid__item__sizer
    //- bottom row of dots
    dot-grid.z2.mbl-hidden(:rows="1", :overlay="false", :keepFirstDot="true", :zeroHeight="true")
</template>

<script>
import DotGrid from '@/components/DotGrid'
export default {
  name: 'HeaderBg',
  components: { DotGrid }
}
</script>

<style lang="scss" scoped>
@import '../../style/variables';

.header-bg{
  padding-bottom: 1px;
  box-shadow: 0 0 50px -20px #000000;
  background:rgba($white, .8);
}
.relative{
  padding:$gutter $gutter 0;
}
.cw-grid{
  top:auto;
  padding-top: 0;
}

@include mobile {
  .header-bg{
    box-shadow:none;
    max-height: calc((100vw - 4rem)/5 + 2rem - 1px);
  }
}
</style>
