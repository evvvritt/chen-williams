<template lang="pug">
  article(:class="{'article--transparent': unavailable}")
    router-link(:to="{name: 'Product', params: {slug: kebab(title)}}")
      section
        header
          h2.text-pad(v-html="title")
          small.text-pad(v-if="price && !unavailable", v-html="'$' + price")
        figure
          slot
</template>

<script>
import _kebab from 'lodash/kebabCase'
export default {
  name: 'CategoryItem',
  props: ['title', 'price', 'fit', 'unavailable'],
  data () {
    return {
      kebab: _kebab
    }
  }
}
</script>

<style lang="scss" scoped>
article{
  position: relative;
  flex:0 0 100%;
  overflow:hidden;
  @media (min-width:769px) {
    flex: 0 0 calc(100%/3);
  }
  @media (min-width:1441px) {
    flex: 0 0 calc(100%/4);
  }
  @media (min-width:1900px) {
    flex: 0 0 calc(100%/5);
  }

  &.article--transparent{
    opacity:.2;
  }

  section{
    padding-bottom:100%;
    > *{
      position: absolute;
      top:0; left:0;
      width:100%;
    }
  }

  header{
    display: flex;
    z-index: 2;
    h2{
      flex:0 0 calc(100% * 2/3);
    }
    small{
      flex:0 0 calc(100% * 1/3);
    }
  }

  figure{
    $offset: 2%;
    width:100% + $offset;
    height:100% + $offset;
    top:-1 * $offset;
    left:-1 * $offset;
  }

  &:hover{
    background:white;
    figure{
      transition:all .2s;
      filter:blur(5px);
      opacity:.7;
    }
  }
}
</style>