<template lang="pug">
ul
  li
    div
    div
    div
    div.tblt-hidden
  li
    div
  li.tblt-hidden
    div
  li
    div
  li
    div
    div
    div
    div.tblt-hidden
</template>

<script>
export default {
  name: 'CategoryItem__DotGrid'
}
</script>

<style lang="scss" scoped>
@import '../style/variables';

ul{
  display: none; // hide by default
  position: absolute;
  width:100%;
  top:0; left:0;
  list-style-type: none;
  flex-direction: column;
  justify-content: space-between;
  // height
  // mobile - 4 cols => 5 rows
  height:calc(100%/4 * 5);
  // > mobile - 3 cols => 4 rows
  @include grid9{ height: calc(100%/3*4); }
}


@supports (pointer-events:none) {
  ul{
    display: flex;
    pointer-events:none;  
  }
}

li, div{
  display: flex;
  justify-content: space-between;
  flex:1 0 0;
}

div{
  // flex:1 0 0;
  &:before, &:after{
    content:'';
    display: block;
    width:2px;
    height:2px;
    background:$black;
  }
  &:before{ transform: translate(-1px, -1px); }
  &:after{ transform: translate(1px, -1px); }
}

</style>
