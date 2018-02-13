import Vue from 'vue'
import Vuex from 'vuex'
import Prismic from 'prismic-javascript'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    prismicUrl: process.env.PRISMIC,
    site: null,
    category: null
  },
  mutations: {
    setSite (state, payload) {
      state.site = payload
    },
    setCategory (state, payload) {
      state.category = payload
    }
  },
  actions: {
    getSite (context) {
      Prismic.getApi(context.state.prismicUrl).then(function (api) {
        return api.getSingle('site')
      }).then((resp) => {
        context.commit('setSite', resp.data)
      }, (err) => {
        console.log('Error: Get Site failed', err)
      })
    },
    getCategory (context) {
      Prismic.getApi(context.state.prismicUrl).then(function (api) {
        return api.getSingle('site')
      }).then((resp) => {
        context.commit('setSite', resp.data)
      }, (err) => {
        console.log('Error: Get Site failed', err)
      })
    }
  }
})
