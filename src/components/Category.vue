<template lang="pug">
  .category.relative.left-align.overflow-hidden.min-h-100vh.p2
    transition(name="overlay")
      router-view
    dot-grid(:rows="gridRows")
    .pt-2rows.fades(ref="body", :class="{'opacity-0': querying}")
      //- Partners
      template(v-if="$route.name === 'Partners'")
        partners
      //- Category Items
      template(v-else)
        transition(name="fade", v-on:after-enter="setGridRows")
          .category__items(v-show="!loading")
            item(v-for="object in category.results", :key="object.id", :object="object")
</template>

<script>
import { mapState } from 'vuex'
import DotGrid from '@/components/DotGrid'
import Item from '@/components/CategoryItem'
import Partners from '@/components/Partners'
import _find from 'lodash/find'
export default {
  name: 'Category',
  props: ['catSlug'],
  components: { Item, DotGrid, Partners },
  data () {
    return {
      querying: false,
      gridRows: 20
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
    },
    'category.results' () {
      this.setGridRows()
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
    },
    setGridRows () {
      const winW = window.innerWidth
      const columns = winW <= 768 ? 4 : winW <= 1440 ? 9 : winW < 1900 ? 12 : 15
      const bodyWidth = this.$refs.body && this.$refs.body.offsetWidth
      if (!bodyWidth) return false
      const block = bodyWidth / columns
      this.gridRows = 1 + parseInt(document.body.scrollHeight / block)
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
  .category__items{
    position: relative;
    z-index:1;
    display: flex;
    flex-wrap: wrap;
    padding-bottom:50vh;
  }
}
</style>
