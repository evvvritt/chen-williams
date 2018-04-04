<template lang="pug">
ul
  li
    div
    div
    div.tblt-hidden
    div.tblt-hidden
  li
    div.item-fill
  li.tblt-hidden
    div.item-fill
  li
    div.item-fill
  li
    div
    div
    div
    div.tblt-hidden
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
  height:calc(100%/4 * 5);
  top:0; left:0;
  list-style-type: none;
  flex-direction: column;
  justify-content: space-between;
}

// hide if supported
@supports ((pointer-events:none) and (display:flex)) {
  ul{
    display: flex;
    pointer-events:none;  
  }
}

li{
  flex:1 0 0;
}

li, div{
  display: flex;
  justify-content: space-between;
}

div{
  &:before, &:after{
    content:'';
    display: block;
    width:2px;
    height:2px;
    background:$black;
  }
  &:before{ transform: translate(-1px, -1px); }
  &:after{ transform: translate(1px, -1px); }
  &:not(.item-fill){
    flex:0 0 25%;
  }
}

@include grid9{
  ul{
    height: calc(100%/3*4);
  }
  div:not(.item-fill){
    flex:0 0 calc(100%/3);
  }
}

</style>
