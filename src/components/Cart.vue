
<template lang="pug">
  aside.cart.fixed.overlay.z-overlay.p2.bg-gray.backdrop-blur
    background(color="gray")
    overlay-header.absolute.top-0.left-0.w-100(@close="$router.push({hash: null})")
    section.pt-1row.left-align(v-if="cart")
      header.flex.items-end
        .cell
        .cell.cell-2.p-text Items
        .cell.p-text Quantity
        .cell.p-text Price
      ul
        li.flex(v-for="item in cart.lineItems")
          div.cell.bg-cover(:style="'background-image:url(' + src(item.variant) + ')'")
          div.cell.cell-2.p-text 
            div {{item.title}}
            div(v-html="details(item.variant)")
          div.cell.p-text {{item.quantity}}
          div.cell.p-text {{item.variant.price | price}}
      footer.flex.justify-end
        .cell
        .cell.p-text {{cart.subtotalPrice | price}} total
        .cell.relative
          a(v-if="cart.webUrl", :href="cart.webUrl")
            .radio-btn-label.p-text Checkout
            radio-btn
</template>

<script>
import Vue from 'vue'
import Background from '@/components/DotGrid'
import OverlayHeader from '@/components/OverlayHeader'
import RadioBtn from '@/components/RadioBtn'
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
      const title = variant.title !== 'Default Title' ? variant.title : ''
      const output = title.length > 0 && variant.weight ? title + ', ' : ''
      return variant.weight ? output + variant.weight + ' lbs' : ''
    },
    src (variant) {
      if (variant.image && Vue.shopClient) {
        const length = window.innerWidth / 9 * window.devicePixelRatio
        return Vue.shopClient.image.helpers.imageForSize(variant.image, {maxWidth: length, maxHeight: length})
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../style/variables';
.cell{
  flex:1 0 auto;
  &:first-child{ padding-bottom:25%; } // sets height
}
@include grid9{
  section{
    width:calc(100% / 9 * 6);
  }
  .cell{
    flex:0 0 calc(100% / 6 * 1);
    &:first-child{
      padding-bottom:calc(100% / 6 * 1);
    }
    &.cell-2{
      flex:0 0 calc(100% / 6 * 2);
    }
  }  
}
</style>
