import Vue from 'vue'
import Vuex from 'vuex'
import Prismic from 'prismic-javascript'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    prismicUrl: process.env.PRISMIC,
    loading: true,
    site: {},
    category: { id: null, results: [] },
    object: { uid: null },
    info: null
  },
  mutations: {
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
    loaded (state) {
      state.loading = false
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
        commit('loaded')
        commit('setSite', resp.results[0].data)
      }, (err) => {
        console.error('Error: Get Site failed', err)
      })
    },
    getCategory ({ commit, state }, id) {
      if (id !== state.category.id) {
        Prismic.getApi(state.prismicUrl).then(function (api) {
          return api.query(
            [
              Prismic.Predicates.at('document.type', 'object'),
              Prismic.Predicates.at('my.object.category', id)
            ],
            { pageSize: 100, fetch: ['object.title', 'object.thumbnail', 'object.tags'] }
          )
        }).then((resp) => {
          commit('setCategory', { ...state.category, id: id, results: resp.results })
        }, (err) => {
          console.error('Error: Get Category failed', err)
        })
      }
    },
    getObject ({ commit, state }, uid) {
      if (uid !== state.object.uid) {
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
