<template lang="pug">
  .category.left-align
    transition(name="overlay")
      router-view
    background
    transition(name="fadeinplace")
      .pt-2rows
        .category__items(v-show="!loading")
          background(:overlay="true", scheme="category", :rows="3", :padless="true")
          item(v-for="object in category", :key="object.id", :object="object")
          //- item(title="Pen & Holder", price="60")
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
import { mapState } from 'vuex'
import Background from '@/components/DotGrid'
import MainContent from '@/components/MainBody'
import Item from '@/components/CategoryItem'
import _find from 'lodash/find'
export default {
  name: 'Category',
  props: ['catSlug'],
  components: {
    MainContent,
    Item,
    Background
  },
  computed: {
    ...mapState([
      'loading',
      'category',
      'site'
    ])
  },
  watch: {
    site () {
      this.getCategory()
    },
    catSlug () {
      this.getCategory()
    }
  },
  methods: {
    getCategory () {
      if (!this.site) return false
      const cat = _find(this.site.nav, (item) => { return item.primary.category_link.uid === this.catSlug })
      if (cat) return this.$store.dispatch('getCategory', cat.primary.category_link.id)
    }
  },
  created () {
    this.getCategory()
  }
}
</script>

<style lang="scss" scoped>
@import '../style/variables';

.category{
  position: relative;
  padding:$gutter;
  min-height:100vh;
  .category__items{
    position: relative;
    z-index:1;
    display: flex;
    flex-wrap: wrap;
  }
}
</style>
