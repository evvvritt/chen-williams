<template lang="pug">
  article.object.fixed.overlay.overflow-y-scroll.overflow-x-hidden.bg-white
    .object__body.relative.min-h-100vh.overflow-hidden.p2.mbl-pb-25vh
      background
      overlay-header.fixed.top-0.left-0.w-100.bg-transp(@close="close")
      .object__main.flex.mbl-flex-wrap(v-if="object.data")
        carousel.object__slideshow(:slides="object.data.slideshow")
        .object__details
          section
            .p-text
              h1 {{object.data.title | text}}
              h6 {{object.data.year}}
              h6 {{object.data.dimensions | text}}
              .mt1(v-if="!soldOut && skus && skus.length > 0", v-show="skus.length > 1")
                label {{selectLbl}}: 
                select(ref="select", v-model="selectedSKUid")
                  option(v-for="(sku, index) in skus", :value="sku.id", :disabled="!sku.available") {{sku.title}}
              .mt1(v-html="$options.filters.richtext(object.data.description)")
              h6.mt1(v-if="price")
                span.strikethrough(v-if="selectedSKU && parseFloat(selectedSKU.compareAtPrice) > 0") {{selectedSKU.compareAtPrice | price}}&nbsp;
                | 
                span {{price | price}}
          aside
            template(v-if="!soldOut")
              .relative(@click="addToCart", aria-label="Add to Cart")
                .radio-btn-label.p-text(v-html="addingToCart ? 'Adding...' : 'Add to Cart'")
                radio-btn(fill="white", :dotted="true")
            template(v-else)
              .radio-btn-label.p-text(style="cursor:default") Sold Out
</template>

<script>
import Vue from 'vue'
import Background from '@/components/DotGrid'
import OverlayHeader from '@/components/OverlayHeader'
import Carousel from '@/components/Carousel'
import RadioBtn from '@/components/RadioBtn'
import _find from 'lodash/find'
import _get from 'lodash/get'
let prevRoute = {}
export default {
  name: 'Object',
  props: ['slug'],
  components: { Background, OverlayHeader, Carousel, RadioBtn },
  data () {
    return {
      addingToCart: false,
      selectedSKUid: ''
    }
  },
  computed: {
    object () {
      return this.$store.state.object
    },
    product () {
      if (!this.object) return false
      const id = _get(this.object, 'data.shopify_product_id')
      return _find(this.$store.state.products, ['_id', id])
    },
    skus () {
      return this.product && this.product.variants // ? this.product.variants : false
    },
    soldOut () {
      return !this.skus || !this.skus.find(sku => sku.available)
    },
    selectedSKU () {
      if (!this.skus) return false
      return _find(this.skus, ['id', this.selectedSKUid])
    },
    price () {
      if (!this.selectedSKU) return false
      return this.selectedSKU.price
    },
    catSlug () {
      const matches = this.$store.state.categories.filter(cat => {
        if (!cat.data.objects) return false
        const obj = _find(cat.data.objects, ['primary.object.id', this.object.id])
        if (obj) return cat
      })
      return matches[0] && matches[0].uid
    },
    selectLbl () {
      return _get(this.object, 'data.variants_select_label[0].text') || 'Options'
    }
  },
  watch: {
    object () {
      this.updateMeta()
    },
    skus (val) {
      this.setDefaultSKUid()
    }
  },
  methods: {
    close () {
      if (prevRoute.name) return this.$router.go(-1)
      const route = this.catSlug ? {name: 'Category', params: {catSlug: this.catSlug}} : '/'
      return this.$router.push(route)
    },
    getObject () {
      if (this.slug) this.$store.dispatch('getObject', this.slug)
    },
    addToCart () {
      if (this.selectedSKUid === '') return false
      this.addingToCart = true
      this.$store.dispatch('addToCart', this.selectedSKUid)
      .then(() => {
        this.addingToCart = false
        this.$router.replace({hash: '#cart'})
      })
      .catch(err => console.error(err))
    },
    updateMeta () {
      if (!this.object || !this.object.data) return false
      const text = this.$options.filters.text
      const title = text(this.object.data.title)
      const descrip = text(this.object.data.meta_description)
      Vue.updateMeta.set(title, descrip)
    },
    setDefaultSKUid () {
      if (this.skus && this.skus[0] && this.skus[0].available) this.selectedSKUid = this.skus[0].id
    }
  },
  beforeRouteEnter (to, from, next) {
    prevRoute = from
    next()
  },
  created () {
    this.getObject()
    this.setDefaultSKUid()
  }
}
</script>

<style lang="scss" scoped>
@import '../style/variables';

.object{
  z-index: $z-overlay;
}

.object__slideshow{
  flex:0 0 cols(6,5);
  height:0;
  padding-bottom:100%;
  @include grid9 {
    flex:0 0 cols(7,9);
    height:auto;
    padding-bottom:0;
  }
  @include grid12 {
    flex:0 0 cols(7,12);
  }
  @include grid15 {
    flex:0 0 cols(7,15);
  }
}

.object__details{
  flex:0 0 100%;
  @media grid9 {
    flex:0 0 cols(2,9);
  }
  @include grid12 {
    flex:0 0 cols(3,12);
  }
  @include grid15 {
    flex:0 0 cols(3,15);
  }

  // content
  @include mobile {
    section{
      width:75%;
      float:left;
    }
    aside{
      width:25%;
      float:left;
    }
  }
  
  @include grid9 {
    flex:0 0 cols(2,9);
    // flex columns
    display:flex;
    flex-direction:column;
    justify-content:space-between;
    section{
      flex:0 0 cols(3,4);
      overflow-y:auto;
    }
    aside{
      flex:0 0 cols(1,4);
    }
  }
}
</style>