<template lang="pug">
  .cw-grid.cw-grid--bg(:class="classes", :data-grid-scheme="scheme", :data-dot-color="color")
    //- column
    .cw-grid__item(v-for="n in ((rows) * columns)", :key="n")
      //- row height (requires separate element in Firefox :/)
      .cw-grid__item__sizer(v-if="!zeroHeight")
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
    keepFirstDot: { type: Boolean, default: false },
    zeroHeight: { type: Boolean, default: false }
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
      this.columns = this.scheme === 'cat-item' ? 3 : w >= 1900 ? 15 : w > 1440 ? 12 : w > 768 ? 9 : 4
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
  align-content:flex-start;

  > .cw-grid__item{
    flex:0 0 25%;
    position: relative;
    
    // dots
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

    > .cw-grid__item__sizer{
      position: relative;
      width:100%;
      height:0;
      padding-bottom: 100%;
      transition:padding-bottom $navCondenseDuration;
    }
  }

  // no dots
  &.cw-grid--no-dots > .cw-grid__item{
    &:after, &:before{
      visibility:hidden;
    }
  }

  // color
  &[data-dot-color="gray"] > .cw-grid__item{
    &:after, &:before{
      background:#8e8e8e;
    }
  }
  
  // scaling ƒ
  @mixin grid-change ($min, $cols) {
    @media (min-width: $min) {
      & > .cw-grid__item{
        // $width: calc(100% / #{$cols});
        $width: (100% / #{$cols});
        flex:0 0 $width;
        max-width: $width; // ie
      }
    }
  }
  // default scheme
  @include grid-change($bkpt-grid-9, 9);
  @include grid-change($bkpt-grid-12, 12);
  @include grid-change($bkpt-grid-15, 15);

  &.cw-grid--bg{
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