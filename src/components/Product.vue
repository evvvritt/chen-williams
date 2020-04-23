<template></template>

<script>
import { mapState } from 'vuex'
import Prismic from 'prismic-javascript'
export default {
  name: 'Product',
  props: ['handle'],
  computed: {
    ...mapState(['products'])
  },
  methods: {
    redirectToObject () {
      const product = this.products.find(p => p.handle === this.handle)
      // not found
      if (!product) {
        console.warn('Shopify product not found: ', this.handle)
        return this.$router.replace('/')
      }
      // find Prismic [Object] by Shopify Product ID
      Prismic.getApi(process.env.PRISMIC).then(api => {
        return api.query(
          Prismic.Predicates.at('my.object.shopify_product_id', product._id)
        )
        .then(({results}) => {
          const obj = results[0]
          // redirect to object view or home
          const rt = obj ? {name: 'CategoryObject', params: {slug: obj.uid}} : '/'
          return this.$router.replace(rt)
        })
        .catch(err => console.error(err))
      })
    }
  },
  watch: {
    products () {
      this.redirectToObject()
    }
  }
}
</script>

<style>
</style>
