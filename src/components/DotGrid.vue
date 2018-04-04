<template lang="pug">
  .cw-grid.cw-grid--background(:class="classes", :data-grid-scheme="scheme", :data-dot-color="color")
    .cw-grid__item(v-for="n in ((rows) * columns)")
</template>

<script>
export default {
  name: 'DotGrid',
  props: {
    scheme: { type: String, default: null },
    rows: { type: Number, default: 20 },
    overlay: { type: Boolean, default: false },
    condensed: { type: Boolean, default: false },
    padless: { type: Boolean, default: false },
    color: { type: String, default: 'black' },
    keepFirstDot: { type: Boolean, default: false }
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
        'cw-grid--padless': this.padless,
        'cw-grid--first-dot': this.keepFirstDot
      }
    }
  },
  methods: {
    setColumns () {
      const w = window.innerWidth
      switch (this.scheme) {
        case 'cat-item':
          this.columns = 3 //  w >= 1900 ? 5 : w > 1440 ? 4 : w > 768 ? 3 : 1
          break
        default:
          this.columns = w >= 1900 ? 15 : w > 1440 ? 12 : w > 768 ? 9 : 4
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
    flex:0 0 25%;
    padding-bottom:25%;
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
    &:nth-last-child(-n+5){
      // padding-bottom:0;
    }
  }

  // colors
  &[data-dot-color="gray"] > .cw-grid__item{
    &:after, &:before{
      background:#8e8e8e;
    }
  }
  
  // scaling ƒ
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
  // &[data-grid-scheme="cat-item"]{
    // > .cw-grid__item{
      // flex:1 0 100%;
    // }
    // @include grid-change($bkpt-grid-9, 3);
    // @include grid9 {
      // .cw-grid__item:nth-child(5),
      // .cw-grid__item:nth-child(8){
        // visibility:hidden;
      // }
    // }
  // }

  &.cw-grid--background{
    position: absolute;
    top:0; left:0;
    width:100%;
    height:100%;
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

  // first dot visibility
  &:not(.cw-grid--first-dot) > .cw-grid__item:first-of-type:before{
    @include grid9 {
      display:none;  
    }
  }
}
</style>