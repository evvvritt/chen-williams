<template lang="pug">
  .cw-grid.cw-grid--background(:class="classes", :data-grid-scheme="scheme")
    .cw-grid__item(v-for="n in ((rows + 1) * columns)")
</template>

<script>
export default {
  name: 'DotGrid',
  props: {
    scheme: {
      type: String,
      default: null
    },
    rows: {
      type: Number,
      default: 40
    },
    overlay: {
      type: Boolean,
      default: false
    },
    condensed: {
      type: Boolean,
      default: false
    },
    padless: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      columns: 0
    }
  },
  computed: {
    classes () {
      return {
        'cw-grid--overlay': this.overlay,
        'cw-grid--condensed': this.condensed,
        'cw-grid--padless': this.padless
      }
    }
  },
  methods: {
    setColumns () {
      const w = window.innerWidth
      switch (this.scheme) {
        case 'category':
          this.columns = w >= 1900 ? 5 : w > 1440 ? 4 : w > 768 ? 3 : 1
          break
        default:
          this.columns = w >= 1900 ? 15 : w > 1440 ? 12 : w > 768 ? 9 : 5
      }
    },
    onResize () {
      const after = setTimeout(() => {
        this.setColumns()
      }, 200)
      clearTimeout(after)
    }
  },
  created () {
    this.setColumns()
    window.addEventListener('resize', this.onResize)
  },
  destroyed () {
    window.removeEventListener('reisze', this.onResize)
  }
}
</script>

<style lang="scss">
@import '../style/variables';

.cw-grid{
  display: flex;
  flex-wrap:wrap;
  align-items:flex-start;
  > .cw-grid__item{
    flex:0 0 20%;
    padding-bottom:20%;
    position: relative;
    transition:padding-bottom $navCondenseDuration;
    &:after, &:before{
      content:'';
      display: block;
      width:2px; height:2px;
      background:black;
      position: absolute;
      top:-1px; left:-1px; 
    }
    &:after{
      right:-1px;
      left:auto;
    }
    &:first-child:before{
      display:none;
    }
    &:nth-last-child(-n+5){
      // padding-bottom:0;
    }
  }
  
  // scaling
  @mixin grid-change ($min, $cols) {
    @media (min-width: $min) {
      & > .cw-grid__item{
        $width: calc(100% / #{$cols});
        flex:0 0 $width;
        padding-bottom: $width;
        &:nth-last-child(-n + #{$cols}){
          // padding-bottom:0;
        }
      }
    }
  }
  // default scheme
  @include grid-change($bkpt-grid-9, 9);
  @include grid-change($bkpt-grid-12, 12);
  @include grid-change($bkpt-grid-15, 15);
  // category scheme
  &[data-grid-scheme="category"]{
    > .cw-grid__item{
      flex:1 0 100%;
    }
    @include grid-change($bkpt-grid-9, 3);
    @include grid-change($bkpt-grid-12, 4);
    @include grid-change($bkpt-grid-15, 5);
  }

  &.cw-grid--background{
    position: absolute;
    top:0; left:0;
    width:100%;
    height:100%;
    overflow:hidden;
    z-index:-1;
    padding:$gutter;
    pointer-events:none;  
    
    &.cw-grid--padless{
      padding:0;
    }

    // set as overlay if can disable pointer
    &.cw-grid--overlay{
      @supports ((pointer-events:none)) {
        z-index:1000;
      }
    }

    // hide on body blur because of Chrome bug
    .app__body--blurred &{
      display:none;
    }
  }

  // condensed
  &.cw-grid--condensed{
    .cw-grid__item{
      @media (min-width:$bkpt-grid-9) {
        padding-bottom: calc(100%/9 * 3/4); // 1.5
      }
      @media (min-width:1100px) {
        padding-bottom: calc(100%/9 * 1/2);
      }
      @media ($bkpt-grid-12) {
        padding-bottom: calc(100%/12 * 1/2);
      }
      @media ($bkpt-grid-15) {
        padding-bottom: calc(100%/15 * 1/2);
      }
    }
  }
}
</style>