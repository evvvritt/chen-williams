import Vue from 'vue'
import Vuex from 'vuex'
import Prismic from 'prismic-javascript'
import Shopify from 'shopify-buy'
import _get from 'lodash/get'
import _find from 'lodash/find'

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
    site: null,
    categories: [],
    objects: { catID: 'no-id', items: [] },
    object: { uid: null },
    info: null,
    products: null,
    partners: null
  },
  getters: {
    cartCount: state => {
      return state.checkout.lineItems.length
    },
    homeCategoryUID: state => {
      return _get(state.site, 'nav[0].primary.category_link.uid')
    }
  },
  mutations: {
    loading (state, payload) {
      state.loading = payload
    },
    setSite (state, payload) {
      state.site = payload
      // update meta defaults
      const title = _get(state.site, 'title[0].text')
      if (title) Vue.updateMeta._siteTitle = title
      const descrip = _get(state.site, 'meta_description[0].text')
      if (descrip) Vue.updateMeta._siteDescription = descrip
    },
    setCategories (state, array) {
      state.categories = array
    },
    setObjects (state, payload) {
      state.objects = payload
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
          Prismic.Predicates.any('document.type', ['site', 'category']),
          { pageSize: 100, fetchLinks: ['category.title', 'tag.label', 'partners.title'] }
        )
      }).then(resp => {
        const categories = []
        for (var i = 0; i < resp.results.length; i++) {
          const doc = resp.results[i]
          if (doc.type === 'site') commit('setSite', doc.data)
          if (doc.type === 'category') categories.push(doc)
        }
        commit('setCategories', categories)
      }, (err) => {
        console.error('Error: Get Site failed', err)
      })
    },
    createCheckout ({ dispatch, commit, state }) {
      const savedId = localStorage.getItem('checkoutId')
      if (savedId) {
        return shop.checkout.fetch(savedId).then((checkout) => {
          commit('setCheckout', checkout)
        }, err => {
          console.error(err)
          console.error('Fetch checkout by ID failed. Creating new...')
          localStorage.removeItem('checkoutId')
          dispatch('createCheckout')
        })
      }
      // else, create new
      return shop.checkout.create().then((checkout) => {
        // save id for future retrieving
        localStorage.setItem('checkoutId', checkout.id)
        commit('setCheckout', checkout)
      }, err => console.error('Create new checkout failed.', err))
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
    getObjectsByCategoryID ({ commit, state }, id) {
      if (!id) return Promise.reject(new Error('No Category ID specified'))
      if (id !== state.objects.catID) {
        const cat = _find(state.categories, ['id', id])
        if (!cat) return false
        const objectIDs = cat.data.objects.map(item => {
          const id = _get(item, 'primary.object.id')
          if (id) return id
        })
        if (objectIDs.length < 1) return false
        Prismic.getApi(state.prismicUrl)
        .then(function (api) { return api.getByIDs(objectIDs) })
        .then(resp => commit('setObjects', { catID: id, items: resp.results }))
        .catch(err => console.error('Error: Get Category Items failed', err))
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
      const lineItemsToAdd = [{ variantId: variantId, quantity: qty, customAttributes: [{key: 'date', value: '2018-04-15'}] }]
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
