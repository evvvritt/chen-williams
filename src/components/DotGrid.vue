<template lang="pug">
  .dot-grid(:data-overlay="overlay")
    div(v-for="n in ((rows + 1) * columns)")
</template>

<script>
export default {
  name: 'DotGrid',
  props: {
    rows: {
      type: Number,
      default: 40
    },
    overlay: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      columns: 0
    }
  },
  methods: {
    setColumns () {
      const w = window.innerWidth
      this.columns = w > 1400 ? 12 : w > 1024 ? 8 : w > 400 ? 6 : 4
    }
  },
  created () {
    this.setColumns()
  }
}
</script>

<style lang="scss" scoped>
@import '../style/variables';

.dot-grid{
  position: absolute;
  top:0; left:0;
  width:100%;
  height:100%;
  overflow:hidden;
  padding:$gutter;
  display:flex;
  flex-wrap: wrap;
  z-index:-1;
  // overlay if pointer-events supported
  &[data-overlay="true"]{
    @supports ((pointer-events:none)) {
      z-index:1000;
      pointer-events:none;  
    }
  }

  div{
    flex:1 0 12.5%;
    padding-bottom:12.5%;
    position: relative;
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
    &:nth-last-child(-n+8){
      padding-bottom:0;
    }
  }
}
</style>