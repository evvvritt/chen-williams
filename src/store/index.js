import Vue from 'vue'
import Vuex from 'vuex'
import Prismic from 'prismic-javascript'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    prismicUrl: process.env.PRISMIC,
    loading: true,
    site: null,
    category: null,
    object: null
  },
  mutations: {
    setSite (state, payload) {
      state.site = payload
    },
    setCategory (state, payload) {
      state.category = payload
    },
    loaded (state) {
      state.loading = false
    }
  },
  actions: {
    getSite ({ commit, state }) {
      Prismic.getApi(state.prismicUrl).then(function (api) {
        return api.query(
          Prismic.Predicates.at('document.type', 'site'),
          { fetchLinks: ['category.title'] }
        )
      }).then((resp) => {
        commit('setSite', resp.results[0].data)
      }, (err) => {
        console.error('Error: Get Site failed', err)
      })
    },
    getCategory ({ commit, state }, id) {
      Prismic.getApi(state.prismicUrl).then(function (api) {
        return api.query(
          Prismic.Predicates.at('document.type', 'object'),
          // Prismic.Predicates.at('my.object.category', id),
          { pageSize: 100, fetch: ['object.title', 'object.thumbnail'] }
        )
      }).then((resp) => {
        commit('loaded')
        commit('setCategory', resp.results)
      }, (err) => {
        console.error('Error: Get Category failed', err)
      })
    }
  }
})
