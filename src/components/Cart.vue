
<template lang="pug">
  aside.cart.fixed.overlay.z-overlay.p2.bg-gray.backdrop-blur
    background(color="gray")
    overlay-header.absolute.z1.top-0.left-0.w-100(@close="$router.push({hash: null})")
    template(v-if="cart && cart.lineItems.length > 0")
      section.left-align
        header.flex.items-end
          .cell
            .cell__sizer
          .cell.cell-2.p-text Items
          .cell.p-text Quantity
          .cell.p-text Price
        ul.relative.z2
          li.flex.items-start(v-for="item in cart.lineItems", v-if="item.variant")
            div.cell
              .cell__sizer.bg-cover.bg-center.relative(:style="'background-image:url(' + src(item.variant) + ')'")
                radio-btn(title="Remove Item", @click="remove(item.id)", fill="white", type="close")
            div.cell.cell-2.p-text 
              div {{item.title}}
              div(v-html="details(item.variant)")
            div.cell.p-text {{item.quantity}}
            div.cell.p-text {{item.variant.price | price}}
        footer.flex.justify-end
          .cell
            .cell__sizer
          .cell.p-text {{cart.subtotalPrice | price}} total
          .cell.relative
            a(v-if="cart.webUrl", :href="cart.webUrl")
              .radio-btn-label.p-text Checkout
              radio-btn
    //- empty cart
    template(v-else)
      .pt-1row.left-align
        .p-text Your cart is empty.
</template>

<script>
import Vue from 'vue'
import Background from '@/components/DotGrid'
import OverlayHeader from '@/components/OverlayHeader'
import RadioBtn from '@/components/RadioBtn'
import _get from 'lodash/get'
export default {
  name: 'Cart',
  components: { Background, OverlayHeader, RadioBtn },
  computed: {
    cart () {
      return this.$store.state.checkout
    }
  },
  methods: {
    details (variant) {
      if (!variant) return ''
      const title = variant.title !== 'Default Title' ? variant.title : ''
      const output = title.length > 0 && variant.weight ? title + ', ' : ''
      return variant.weight ? output + variant.weight + ' lbs' : ''
    },
    src (variant) {
      if (!variant || !Vue.shopClient) return ''
      const img = variant.image || _get(variant, 'product.images[0]')
      if (!img) return ''
      const ratio = window.devicePixelRatio || 1
      const winW = window.innerWidth
      let length = Vue.is('mobile') ? winW / 4 * ratio : winW / 9 * ratio
      length = parseInt(length)
      return Vue.shopClient.image.helpers.imageForSize(img, {maxWidth: length, maxHeight: length})
    },
    remove (id) {
      if (id) this.$store.dispatch('removeCartItems', [id])
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../style/variables';

.cell{
  flex:0 0 25%;
}
.cell__sizer{
  padding-bottom:100%;
}

@include grid9{
  section{
    width:calc(100% / 9 * 6);
  }
  .cell{
    flex:0 0 (100% / 6 * 1);
    &.cell-2{
      flex:0 0 (100% / 6 * 2);
    }
  }
}

@include grid12{
  section{
    width:calc(100% / 12 * 6);
  }
}

@include grid15{
  section{
    width:calc(100% / 15 * 6);
  }
}
</style>
