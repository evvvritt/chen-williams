<template lang="pug">
  article.object.overlay
    .object__body.overflow-hidden
      background
      overlay-header.object__header(@close="close")
      .object__main.mb-pt-1row(v-if="object.data")
        carousel.object__slideshow(:slides="object.data.slideshow")
        .object__details
          section
            .p-text
              h1 {{object.data.title | text}}
              h6 {{object.data.year}}
              h6 {{object.data.dimensions | text}}
              div.mt1(v-html="richtext(object.data.description)")
              h6.mt1(v-if="price") {{price | price}}
          aside(@click="addToCart")
            .relative
              .radio-btn-label.p-text(v-html="addingToCart ? 'Adding...' : 'Add to Cart'")
              radio-btn(fill="white", :dotted="true")
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
      richtext: this.$options.filters.richtext,
      addingToCart: false
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
        this.addingToCart = true
        this.$store.dispatch('addToCart', this.variant.id).then(() => {
          this.addingToCart = false
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
</style>