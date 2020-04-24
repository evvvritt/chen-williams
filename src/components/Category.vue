<template lang="pug">
  .category.relative.left-align.overflow-hidden.min-h-100vh.p2
    transition(name="overlay")
      router-view
    .pt-2rows.fades(ref="body", :class="{'opacity-0': loading}")
      transition-group(name="results")
        //- Partners
        div(v-if="$route.name === 'Partners'", key="partners")
          partners
        //- Category Items
        div(v-else, key="items")
          transition-group(name="results", v-on:after-enter="setGridRows")
            section.category__items(:key="objects.catID")
              item(v-for="object in objects.items", :key="object.id", :object="object")
    //- dot-grid(:rows="gridRows")
</template>

<script>
import Vue from 'vue'
import { mapState } from 'vuex'
import _find from 'lodash/find'
import DotGrid from '@/components/DotGrid'
import Item from '@/components/CategoryItem'
const Partners = () => import('@/components/Partners')
export default {
  name: 'Category',
  props: ['catSlug'],
  components: { Item, DotGrid, Partners },
  data () {
    return {
      gridRows: 20,
      getText: this.$options.filters.text
    }
  },
  computed: {
    ...mapState([
      'loading',
      'objects'
    ]),
    category () {
      return _find(this.$store.state.categories, ['uid', this.catSlug])
    }
  },
  watch: {
    category () {
      this.getItems()
      this.updateMeta()
    },
    'objects.items' () {
      this.setGridRows()
    },
    '$route' () {
      this.updateMeta()
    }
  },
  methods: {
    getItems () {
      if (this.$route.name !== 'Category' || !this.category || !this.category.id) return false
      this.$store.dispatch('getObjectsByCategoryID', this.category.id).catch(err => console.error(err))
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
    },
    updateMeta () {
      if (this.$route.name !== 'Category') return false
      let title, descrip, cannonical
      const isHome = this.$store.getters.homeCategoryUID === this.category.uid
      title = !isHome ? this.getText(this.category.data.title) : title
      descrip = !isHome ? this.getText(this.category.data.meta_description) : descrip
      Vue.updateMeta.set(title, descrip, cannonical)
    }
  },
  created () {
    this.getItems()
  }
}
</script>

<style lang="scss" scoped>
@import '../style/variables';

.results-enter-active{
  transition: opacity 600ms 400ms;
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
