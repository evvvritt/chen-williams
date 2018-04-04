<template lang="pug">
  .category.left-align.overflow-hidden.min-h-100vh
    transition(name="overlay")
      router-view
    background
    .pt-2rows.fades(:class="{'opacity-0': querying}")
      //- Partners
      template(v-if="$route.name === 'Partners'")
        partners
      //- Category Items
      template(v-else)
        transition(name="fade")
          .category__items(v-show="!loading")
            //- background(:overlay="true", scheme="category", :rows="3", :padless="true")
            item(v-for="object in category.results", :key="object.id", :object="object")
</template>

<script>
import { mapState } from 'vuex'
import Background from '@/components/DotGrid'
import Item from '@/components/CategoryItem'
import Partners from '@/components/Partners'
import _find from 'lodash/find'
export default {
  name: 'Category',
  props: ['catSlug'],
  components: { Item, Background, Partners },
  data () {
    return {
      querying: false
    }
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
      const cat = _find(this.site.nav, (navItem) => { return navItem.primary.category_link.uid === this.catSlug })
      if (!cat) return false
      this.querying = true
      this.$store.dispatch('getCategory', cat.primary.category_link.id).then(() => {
        this.querying = false
      })
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
    padding-bottom:50vh;
  }
}
</style>
