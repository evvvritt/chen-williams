import Vue from 'vue'
import Vuex from 'vuex'
import Prismic from 'prismic-javascript'
import Shopify from 'shopify-buy'

Vue.use(Vuex)

Vue.shopClient = Shopify.buildClient({
  domain: process.env.SHOPIFY.DOMAIN,
  storefrontAccessToken: process.env.SHOPIFY.TOKEN
})
const shop = Vue.shopClient

export default new Vuex.Store({
  state: {
    prismicUrl: process.env.PRISMIC,
    checkout: { lineItems: [] },
    loading: true,
    querying: false,
    site: {},
    category: { id: null, results: [] },
    object: { uid: null },
    info: null,
    products: null,
    partners: null
  },
  mutations: {
    loading (state, payload) {
      state.loading = payload
    },
    querying (state, payload) {
      state.querying = payload
    },
    setSite (state, payload) {
      state.site = payload
    },
    setCategory (state, payload) {
      state.category = payload
    },
    setObject (state, payload) {
      state.object = payload
    },
    setInfo (state, payload) {
      state.info = payload
    },
    setCheckout (state, payload) {
      state.checkout = payload
    },
    setProducts (state, payload) {
      state.products = payload
    },
    setPartners (state, payload) {
      state.partners = payload
    }
  },
  actions: {
    getSite ({ commit, state }) {
      Prismic.getApi(state.prismicUrl).then(function (api) {
        return api.query(
          Prismic.Predicates.at('document.type', 'site'),
          { fetchLinks: ['category.title', 'tag.label', 'partners.title'] }
        )
      }).then((resp) => {
        commit('loading', false)
        commit('setSite', resp.results[0].data)
      }, (err) => {
        console.error('Error: Get Site failed', err)
      })
    },
    createCheckout ({ commit, state }) {
      const savedId = window.localStorage.getItem('checkoutId')
      if (savedId) {
        return shop.checkout.fetch(savedId).then((checkout) => {
          commit('setCheckout', checkout)
        })
      }
      // else, create new
      return shop.checkout.create().then((checkout) => {
        window.localStorage.setItem('checkoutId', checkout.id) // save id for future retrieving
        commit('setCheckout', checkout)
      })
    },
    getProducts ({ commit, state }) {
      shop.product.fetchAll().then((results) => {
        const products = results.map((item) => {
          let id = atob(item.id).split('/')
          id = id[id.length - 1]
          return { ...item, _id: id }
        })
        commit('setProducts', products)
      }, (err) => {
        console.error('Error: Get Products failed', err)
      })
    },
    getCategory ({ commit, state }, id) {
      if (id !== state.category.id) {
        commit('querying', true)
        Prismic.getApi(state.prismicUrl).then(function (api) {
          return api.query(
            [
              Prismic.Predicates.at('document.type', 'object'),
              Prismic.Predicates.at('my.object.category', id)
            ],
            { pageSize: 100, fetch: ['object.title', 'object.thumbnail', 'object.tags', 'object.shopify_product_id'] }
          )
        }).then((resp) => {
          commit('querying', false)
          commit('setCategory', { ...state.category, id: id, results: resp.results })
        }, (err) => {
          commit('querying', false)
          console.error('Error: Get Category failed', err)
        })
      }
    },
    getObject ({ commit, state }, uid) {
      if (uid !== state.object.uid) {
        commit('setObject', {}) // reset
        Prismic.getApi(state.prismicUrl).then(function (api) {
          return api.getByUID('object', uid)
        }).then((doc) => {
          commit('setObject', doc)
        }, (err) => {
          console.error('Error: Get Object failed', err)
        })
      }
    },
    getInfo ({ commit, state }) {
      if (!state.info) {
        Prismic.getApi(state.prismicUrl).then(function (api) {
          return api.getSingle('info')
        }).then((doc) => {
          commit('setInfo', doc.data)
        }, (err) => {
          console.error('Error: Get Info failed', err)
        })
      }
    },
    getPartners ({ commit, state }) {
      if (state.partners) return false
      Prismic.getApi(state.prismicUrl).then(function (api) {
        return api.getSingle('partners')
      }).then((doc) => {
        commit('setPartners', doc.data)
      }, (err) => {
        console.error('Error: Get Partners failed', err)
      })
    },
    addToCart ({ commit, state }, variantId, qty = 1) {
      if (!state.checkout.id) return false
      const lineItemsToAdd = [{ variantId: variantId, quantity: qty }]
      shop.checkout.addLineItems(state.checkout.id, lineItemsToAdd).then((checkout) => {
        commit('setCheckout', checkout)
      })
    },
    removeCartItems ({ commit, state }, lineItemIds) {
      if (!lineItemIds) return false // Remove an item from the checkout
      shop.checkout.removeLineItems(state.checkout.id, lineItemIds).then((checkout) => {
        commit('setCheckout', checkout)
      })
    }
  }
})
