<template lang="pug">
  article(v-show="visible", :class="{'article--transparent': !available}")
    router-link(:to="{name: 'CategoryObject', params: {slug: object.uid}}")
      section
        header.flex.z2
          h2.p-text {{object.data.title | text}}
          small.p-text(v-if="price && !available") Sold Out
          small.p-text(v-else-if="price") {{price | price}}
        figure
          img(:src="object.data.thumbnail.url")
</template>

<script>
import _find from 'lodash/find'
export default {
  name: 'CategoryItem',
  props: ['object'],
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
    h2{
      flex:0 0 calc(100% * 2/3);
    }
    small{
      flex:0 0 calc(100% * 1/3);
    }
  }

  figure{
    $offset: 3%;
    width:100% + $offset;
    height:100% + $offset;
    top:-1 * $offset;
    left:-1 * $offset;
  }

  .no-touchevents &:hover{
    background:white;
    figure{
      transition:all .2s;
      filter:blur(5px);
      opacity:.7;
    }
  }
}
</style>