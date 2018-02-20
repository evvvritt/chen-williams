import Vue from 'vue'
import Vuex from 'vuex'
import Prismic from 'prismic-javascript'
import Shopify from 'shopify-buy'
const shop = Shopify.buildClient({
  domain: process.env.SHOPIFY.DOMAIN,
  storefrontAccessToken: process.env.SHOPIFY.TOKEN
})

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    prismicUrl: process.env.PRISMIC,
    loading: true,
    querying: false,
    site: {},
    category: { id: null, results: [] },
    object: { uid: null },
    info: null,
    products: null
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
    setProducts (state, payload) {
      state.products = payload
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
    getProducts ({ commit, state }) {
      shop.product.fetchAll().then((results) => {
        const products = results.map((item) => {
          let id = atob(item.id).split('/')
          id = id[id.length - 1]
          return { ...item, _id: id }
        })
        commit('setProducts', products)
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
            { pageSize: 100, fetch: ['object.title', 'object.thumbnail', 'object.tags'] }
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
          console.error('Error: Get Object failed', err)
        })
      }
    }
  }
})
