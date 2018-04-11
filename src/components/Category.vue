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
        transition-group(name="results", v-on:after-enter="setGridRows")
          .category__items(:key="category.id", v-show="!loading || !querying")
            item(v-for="object in category.results", :key="object.id", :object="object")
</template>

<script>
import { mapState } from 'vuex'
import DotGrid from '@/components/DotGrid'
import Item from '@/components/CategoryItem'
import Partners from '@/components/Partners'
import _find from 'lodash/find'
import _get from 'lodash/get'
export default {
  name: 'Category',
  props: ['catSlug'],
  components: { Item, DotGrid, Partners },
  data () {
    return {
      querying: true,
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
    getCatIDbyUID (uid) {
      if (!this.site || !this.site.nav) return false
      const cat = _find(this.site.nav, (navItem) => {
        return navItem.primary.category_link.uid === uid
      })
      return _get(cat, 'primary.category_link.id')
    },
    getCategory () {
      const catId = this.getCatIDbyUID(this.catSlug)
      if (!catId) return false
      this.querying = true
      this.$store.dispatch('getCategory', catId).then(() => {
        this.querying = false
      }, err => {
        console.error(err)
        this.querying = false
      })
    },
    setGridRows () {
      const calcRows = () => {
        const winW = window.innerWidth
        const columns = winW <= 768 ? 4 : winW <= 1440 ? 9 : winW < 1900 ? 12 : 15
        const bodyWidth = this.$refs.body && this.$refs.body.offsetWidth
        if (!bodyWidth) return false
        const block = bodyWidth / columns
        this.gridRows = 1 + parseInt(document.body.scrollHeight / block)
      }
      this.$nextTick(calcRows)
    }
  },
  created () {
    this.getCategory()
  }
}
</script>

<style lang="scss" scoped>
@import '../style/variables';

.results-enter-active{
  transition: opacity 600ms 400ms
}
.results-leave-active{
  transition: opacity 400ms
}
.results-enter,
.results-leave-to{
  opacity:0;
}

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
