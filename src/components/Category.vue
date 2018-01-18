<template lang="pug">
  .category.left-align
    transition(name="fadeinplace")
      div(v-show="!loading")
        section
          dot-grid(:overlay="true", scheme="category", :rows="3", :padless="true")
          item(title="Handle", price="20")
            img(src="../demo/A1_01.jpg")
          item(title="Pen & Holder", price="60")
            img(src="../demo/CK-GEM_Pen_P02.jpg")
          item(title="Copper Box", price="120")
            img(src="../demo/D1_01.jpg")
          item(title="Cherry Box", price="20", unavailable="true")
            img(src="../demo/CK-GEM_Drum_P03.jpg")
          item(title="Mirror", price="20")
            img(src="../demo/CK-GEM_Pen_P01.jpg")
          item(title="Pen", price="20")
            img(src="../demo/B2_01.jpg")
          item(title="Pils", price="20")
            img(src="../demo/CK-GEM_Pill_AB02.jpg")
          item(title="Keys", price="20")
            img(src="../demo/CK-GEM_Hook1_02.jpg")
</template>

<script>
import DotGrid from '@/components/DotGrid'
import Item from '@/components/CategoryItem'
export default {
  name: 'Category',
  props: ['loading'],
  components: {
    Item,
    DotGrid
  },
  data () {
    return {

    }
  }
}
</script>

<style lang="scss" scoped>
@import '../style/variables';

.category{
  padding:$gutter;
  > div{
    padding-top: 20%;
    @media (min-width:769px) {
      padding-top: calc(100% / 9 * 2);
    }
    > section{
      position: relative;
      display: flex;
      flex-wrap: wrap;
    }
  }
}
</style>
