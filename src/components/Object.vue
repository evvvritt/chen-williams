<template lang="pug">
  article.object.overlay
    .object__body
      background
      overlay-header.object__header(@close="close")
      .object__main.pt-1row(v-if="object.data")
        carousel.object__slideshow(:slides="object.data.slideshow")
        .object__details.relative
          section.p-text.relative.z2.mb-w-75
            h1 {{object.data.title | text}}
            h6 {{object.data.year}}
            h6 {{object.data.dimensions | text}}
            div.mt1(v-html="richtext(object.data.description)")
            h6.mt1(v-if="price") {{price | price}}
          .object__buy-btn.absolute.z1.w-100(@click="addToCart")
            .relative
              .radio-btn-label.p-text Add to Cart
              radio-btn
</template>

<script>
import Background from '@/components/DotGrid'
import OverlayHeader from '@/components/OverlayHeader'
import Carousel from '@/components/Carousel'
import RadioBtn from '@/components/RadioBtn'
import _find from 'lodash/find'
export default {
  name: 'Object',
  props: ['slug'],
  components: { Background, OverlayHeader, Carousel, RadioBtn },
  data () {
    return {
      richtext: this.$options.filters.richtext
    }
  },
  computed: {
    object () {
      return this.$store.state.object
    },
    variant () {
      if (!this.object) return false
      const id = this.object.data.shopify_product_id
      const product = _find(this.$store.state.products, id)
      if (!product) return false
      const hasVariants = product.variants && product.variants.length > 0
      return hasVariants ? product.variants[0] : false
    },
    price () {
      if (!this.variant) return false
      return this.variant.price
    }
  },
  methods: {
    close () {
      const route = this.$route.meta.closeTo ? {name: this.$route.meta.closeTo} : '/'
      this.$router.push(route)
    },
    getObject () {
      if (this.slug) this.$store.dispatch('getObject', this.slug)
    },
    addToCart () {
      if (this.variant) {
        this.$store.dispatch('addToCart', this.variant.id).then(() => {
          this.$router.push({hash: '#cart'})
        })
      }
    }
  },
  created () {
    this.getObject()
  }
}
</script>

<style lang="scss" scoped>
@import '../style/variables';

.object{
  position: fixed;
  width:100%;
  height:100%;
  overflow-x:hidden;
  overflow-y:auto;
  z-index: $z-overlay;
  background:$white;
  .app-header{
    position: absolute;
    background:transparent;
  }
}
.object__body{
  position: relative;
  padding:$gutter;
  min-height:100vh;
}

.object__main{
  display: flex;
  flex-wrap: wrap;
  @media (min-width:769px) {
    flex-wrap: no-wrap;
  }
}
// column widths
.object__slideshow{
  flex:0 0 calc(100%/5 * 6);
  height:0;
  padding-bottom:100%;
  @include grid9 {
    flex:0 0 calc(100%/9 * 7);
    height:auto;
    padding-bottom:0;
  }
  @include grid12 {
    flex:0 0 calc(100%/12 * 7);
  }
  @include grid15 {
    flex:0 0 calc(100%/15 * 7);
  }
}
.object__details{
  flex:0 0 100%;
  @media (min-width:769px) {
    flex:0 0 calc(100%/9 * 2);
  }
  @include grid12 {
    flex:0 0 calc(100%/12 * 3);
  }
  @include grid15 {
    flex:0 0 calc(100%/15 * 3);
  }
}

.object__header{
  position: fixed;
  top:0; left:0;
  width:100%;
}

.object__slideshow{
  overflow:auto;
  overflow-y:hidden;
  scroll-snap-type: proximity;
  > div{
    width:auto;
    white-space:nowrap;
  }
  figure{
    scroll-snap-align: start;
    display: inline-block;
    img{
      width:100%;
    }
  }
}

.object__buy-btn{
  position: absolute;
  top:0;
  left:75%;
  max-width:25%;
  @include grid9 {
    max-width:none;
    top:0;
    padding-top:calc(100% / 2 * 3);
    left:0;
  }
  @include grid12 {
    padding-top:calc(100% / 3 * 3);
  }
}
</style>