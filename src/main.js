// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import PrismicDOM from 'prismic-dom'

Vue.config.productionTip = process.env.NODE_ENV === 'production'

// Prismic raw Text
Vue.filter('text', function (value) {
  if (!value || !value[0]) return ''
  return value[0].text
})

// Prismic Rich Text
Vue.filter('richtext', function (key) {
  if (!key) return ''
  const html = PrismicDOM.RichText.asHtml(key, (doc) => {
    // Link Resolving
    // if (doc.type === 'collection') return '/collections/' + doc.uid
    if (doc.type === 'info') return '#info'
    if (doc.type === 'site') return '/'
    // Fallback
    return '/doc/' + doc.uid
  })
  return html
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
