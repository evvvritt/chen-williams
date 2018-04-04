<template lang="pug">
  article.relative.item-fill.overflow-hidden(v-show="visible", :class="{'article--transparent': !available}")
    router-link(:to="{name: 'CategoryObject', params: {slug: object.uid}}")
      section.pb-100
        header.absolute.top-0.left-0.w-100.flex.z2
          h2.p-text {{object.data.title | text}}
          small.p-text(v-if="price && !available") Sold Out
          small.p-text(v-else-if="price") {{price | price}}
        figure.absolute.top-0.left-0.w-100.overflow-hidden
          img.block(:src="object.data.thumbnail.url")
    dot-grid.overlay.absolute
</template>

<script>
import DotGrid from '@/components/CategoryItem__DotGrid'
import _find from 'lodash/find'
export default {
  name: 'CategoryItem',
  props: ['object'],
  components: { DotGrid },
  computed: {
    tags () {
      return this.object.data.tags.map((item) => { return item.tag.uid })
    },
    visible () {
      if (!this.$route.query.filter) return true // no filters
      if (!this.tags || this.tags.length < 1) return false // filters, but no tags
      const filters = this.$route.query.filter.split(',')
      return this.tags.some(function (tag) { // quits on first match
        return filters.indexOf(tag) >= 0
      })
    },
    sku () {
      if (!this.object) return false
      const id = this.object.data.shopify_product_id
      const product = _find(this.$store.state.products, ['_id', id])
      const hasVariants = product && product.variants && product.variants.length > 0
      return hasVariants ? product.variants[0] : false
    },
    price () {
      return this.sku ? this.sku.price : false
    },
    available () {
      return this.sku ? this.sku.available : true
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../style/variables';

article{
  //overflow:hidden;
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

  header{
    h2{
      flex:0 0 calc(100% * 2/3);
    }
    small{
      flex:0 0 calc(100% * 1/3);
    }
  }

  img{
    transform: scale(1.05, 1.05);
    transform-origin:center center;
  }
  
  // blur image on over
  .no-touchevents &:hover{
    background:white;
    img{
      transition:all .2s;
      filter:blur(5px);
      opacity:.7;
    }
  }
}
</style>