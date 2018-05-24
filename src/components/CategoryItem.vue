<template lang="pug">
  article.relative.item-fill.overflow-hidden(v-show="visible", :class="{'article--transparent': !available}")
    router-link(:to="{name: 'CategoryObject', params: {slug: object.uid}}")
      section.pb-100
        header.absolute.top-0.left-0.w-100.flex.z2
          h2.p-text {{object.data.title | text}}
          small.p-text(v-if="price && !available") Sold Out
          small.p-text(v-else-if="price")
            span.strikethrough(v-if="sku.compareAtPrice && parseFloat(sku.compareAtPrice) > 0") {{sku.compareAtPrice | price}}&nbsp;
            | 
            span {{price | price}}
        figure.absolute.top-0.left-0.w-100.overflow-hidden
          transition(name="fade")
            img.block.w-100(:src="thumb(object.data.thumbnail.url)", @load="imgLoaded = true", v-show="imgLoaded")
    dot-grid.overlay.absolute
</template>

<script>
import Vue from 'vue'
import DotGrid from '@/components/CategoryItem__DotGrid'
import _find from 'lodash/find'
export default {
  name: 'CategoryItem',
  props: ['object'],
  components: { DotGrid },
  data () {
    return {
      imgLoaded: false
    }
  },
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
  },
  methods: {
    thumb (src) {
      if (!src) return
      const getImgW = (winW) => winW >= 1900 ? winW / 5 : winW > 1440 ? winW / 4 : winW > 768 ? winW / 3 : winW
      return Vue.thumbSrc(src, getImgW(window.innerWidth))
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../style/variables';

article{
  &.article--transparent{
    opacity:.2;
  }
  
  // hover effects
  .no-touchevents &:hover{
    background:white;
    img{
      transition:all .2s;
      opacity:.7;
    }
  }
  // blur, if enabled
  .no-touchevents .app--blur-enabled &:hover img{
    filter:blur(5px);
  }
}

header{
  h2{
    flex:0 0 75%;
  }
  small{
    flex:0 0 25%;
  }
}

img{
  transform: scale(1.05, 1.05);
  transform-origin:center center;
}

@include grid9 {
  article{
    flex: 0 0 (100%/3);
  }
  header{
    h2{
      flex:0 0 (100% * 2/3);
    }
    small{
      flex:0 0 (100% * 1/3);
    }
  }
}

@include grid12 {
  article{
    flex: 0 0 (100%/4);
  }
}

@include grid15 {
  article{
    flex: 0 0 (100%/5);
  }
}
</style>