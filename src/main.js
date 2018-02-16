// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import PrismicDOM from 'prismic-dom'

Vue.config.productionTip = process.env.NODE_ENV === 'production'
Vue.config.IMG = {
  url: process.env.CLOUDINARY,
  sizes: [320, 480, 640, 1024, 1280, 1536, 1750, 2048, 2389]
}

// Cloudinary thumb fetching
Vue.thumbSrc = (src, length, useHeight = false, format = 'jpg') => {
  // return `${Vue.config.IMG.url}/image/fetch/${src}`
  let optimal = 0
  const dpx = window.devicePixelRatio / 1.25 // less density optically ok ?
  length = length * dpx
  const sizes = Vue.config.IMG.sizes
  for (var i = 0; i < sizes.length; i++) {
    if (length <= sizes[i]) {
      optimal = sizes[i]
      break
    }
  }
  const size = optimal === 0 ? sizes[sizes.length - 1] : optimal
  const urlParam = useHeight ? 'h_' + size : 'w_' + size
  return `${Vue.config.IMG.url}/image/fetch/q_auto:best,${urlParam},f_${format}/${src}`
}

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
